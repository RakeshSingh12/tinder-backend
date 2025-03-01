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
  //Create a new instance of the user Model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("Failed to save user" + err.message);
  }
});

// Retrieve a specific user by email from the database
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

// delete specific user details from the database by userId

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

// update specific user details from the database by userId

app.put("/user", async (req, res) => {
  const userId = req.body.userId;
  const updatedUser = req.body;
  console.log(updatedUser)

  try {
    const user = await User.findByIdAndUpdate((userId), updatedUser);
    if (!user) {
      res.status(404).send("User data not update"); // return a 404 Not Found status code with a message
    } else {
      res.send("user data updated successfully");
    }
  } catch (err) {
    res.status(400).send("Failed to update user -->" + err.message);
  }
});

// Retrieve a all uset data from the  database
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

connectDB()
  .then(() => {
    console.log("MongoDB database connection established...");
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });

app.listen(port, () => {
  console.log("listening the server");
});
