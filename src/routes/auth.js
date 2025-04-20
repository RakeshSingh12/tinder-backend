const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");

const authRouter = express.Router();

/* Signup API */
authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    const { firstName, lastName, email, password, about, skills } = req.body;

    //Encript the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    /* Create a new instance of the user Model */
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      about,
      skills,
    });
    const saveUser = await user.save();
    const token = await saveUser.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
    res.json({massage : "User saved successfully", data : saveUser});
  } catch (err) {
    res.status(400).send("Error --->" + err.message);
  }
});

/* Login API */
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Please enter a valid email address");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials(Email)");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.json(user);
    } else {
      throw new Error(" Password is incorrect");
    }
  } catch (err) {
    res.status(400).send("ERROR ::  " + err.message);
  }
});

/* Logout API */
authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logged out successfully");
  //or

  /*   res.cookie("token" , null, { expires: new Date(Date.now())});
  res.send("Logged out successfully"); */
});

module.exports = authRouter;
