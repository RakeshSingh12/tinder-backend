const jwt = require("jsonwebtoken");
const User = require("../module/user");

// middleware to authenticate user
const userAuth = async (req, res, next) => {
  //Read the toekn from the request cookies
  // validate the token and find the user
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valud!!!!!");
    }

    const decodeObj = await jwt.verify(token, "DEV@Tinder$97521");

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
