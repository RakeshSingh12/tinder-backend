const express = require("express");

//import mongoDB database
require("./config/database");
const connectDB = require("./config/database");
const User = require("./module/user");
// import middleware file

const app = express();
app.use(express.json());
const port = 7777;

app.post("/signup", async (req, res) => {

/* Create a new instance of the user Model */
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("Failed to save user --->" + err.message);
  }
});

 /* Retrieve a specific user by email from the database */
app.get("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const userEmail = await User.find({ email: email });
    if (userEmail.length === 0) {
      res.status(404).send("User not found"); // return a 404 Not Found status code with a message
    } else {
      res.send(userEmail);
    }
  } catch (err) {
    res.status(400).send("Failed to get user" + err.message);
  }
});

 /* delete specific user details from the database by userId */

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    //const user =  await User.findByIdAndDelete({_id : userId});
    if (!user) {
      res.status(404).send("User not found"); // return a 404 Not Found status code with a message
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    res.status(400).send("Failed to delete user" + err.message);
  }
});

/*  update specific user details from the database by userId */

app.patch("/user/:userId", async (req, res) => {
  //const userId = req.body.userId;

/*  dynamically update */
  const userId =  req.params?.userId;
  const updatedUser = req.body;
  console.log(updatedUser);

  try {

    /*  validate the fields to update(Sanitize DB Object) */
    const ALLOWED_UPDATES = ["lastName","firstName" ,"password","skills","gender", "age","photoURL", "phone"];

    const isUpdateAllowed = Object.keys(updatedUser).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
       throw  new Error("update not allowed");
    }

     /* age validation */
    if (updatedUser?.age < 18 || updatedUser?.age > 100) {
      throw new Error("age should be between 18 and 100");
    }
     /* skills validation */
    if (updatedUser?.skills.length > 10) {
      throw new Error("skills should not allowed more than 10");
    }
    /* password validation */
    if (updatedUser?.password.length < 8) {
      throw new Error("password should be at least 8 characters long");
    }
  
    /*  update the user */
    const opts = { runValidators: true };
    const user = await User.findByIdAndUpdate((userId), updatedUser,opts);
    if (!user) {
      res.status(404).send("User data not update"); // return a 404 Not Found status code with a message
    } else {
      res.send("user data updated successfully");
    }
  } catch (err) {
    res.status(400).send("Failed to update user -->" + err.message);
  }
});

 /* Retrieve a all uset data from the  database */
app.get("/feeds", async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      res.status(404).send("No user found"); // return a 404 Not Found status code with a message
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(404).send(" something went wrong.");
  }
});


/* Start the server */
connectDB()
  .then(() => {
    console.log("MongoDB database connection established...");
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });

/*  listen port number */
app.listen(port, () => {
  console.log("listening the server");
});
