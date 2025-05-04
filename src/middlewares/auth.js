const jwt = require("jsonwebtoken");
const User = require("../models/user");

// middleware to authenticate user
const userAuth = async (req, res, next) => {
  //Read the toekn from the request cookies
  // validate the token and find the user
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login");
    }

    const decodeObj = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodeObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

module.exports = {
  userAuth,
};
