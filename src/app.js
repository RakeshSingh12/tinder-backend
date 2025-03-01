const express = require('express');

//import mongoDB database
require('./config/database');
const connectDB = require("./config/database");
const User = require("./module/user");
// import middleware file

const app = express();
const port = 7777;


app.post("/signup", async (req, res) => {
    //Create a new instance of the user Model
    const user = new User({
        firstName : "Trishika",
        lastName : "Singh",
        email : "rakeshaug2022@gmail.com",
        password : "UR62JY5pL4UXWyTM",
        age : 25,
        
    });

    try {
        await user.save();
        res.send("User saved successfully")
    } catch (err) { 
        res.status(400).send("Failed to save user"+ err.message);
    }
})


connectDB().then(() =>{
    console.log("MongoDB database connection established...");
})
.catch((err) =>{
    console.error("Database connection error", err);
});


app.listen(port, () =>{
    console.log("listening the server")
})