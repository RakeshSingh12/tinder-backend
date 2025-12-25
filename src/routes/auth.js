const express = require("express");
const { validateSignUpData } = require("../utils/validation");

const User = require("../models/user");
const validator = require("validator");
const { asyncHandler } = require("../middlewares/errorHandler");
const { ApiError } = require("../middlewares/errorHandler");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

/* Signup API */
authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, email, password, about, skills } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    // Create a new instance of the user Model
    const user = new User({
      firstName,
      lastName,
      email,
      password, // Password will be hashed by pre-save middleware
      about,
      skills,
    });

    const savedUser = await user.save();

    // Generate JWT token
    const token = await savedUser.getJWT();

    // Set cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + config.cookieExpiresIn),
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
    });

    // Return user data without password
    const userResponse = savedUser.getPublicProfile();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse,
      token,
    });
  }),
);

/* Login API */
authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Please enter a valid email address");
    }

    // Find user and include password for validation
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (!user.isActive) {
      throw new ApiError(401, "Account is deactivated");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generate JWT token
    const token = await user.getJWT();

    // Set cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + config.cookieExpiresIn),
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
    });

    // Return user data without password
    const userResponse = user.getPublicProfile();

    res.json({
      success: true,
      message: "Login successful",
      data: userResponse,
      token,
    });
  }),
);

/* Logout API */
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

/* Refresh token API */
authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
      throw new ApiError(401, "No token provided");
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded._id).select("-password");

      if (!user || !user.isActive) {
        throw new ApiError(401, "User not found or inactive");
      }

      // Generate new token
      const newToken = await user.getJWT();

      res.cookie("token", newToken, {
        expires: new Date(Date.now() + config.cookieExpiresIn),
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: "strict",
      });

      res.json({
        success: true,
        message: "Token refreshed successfully",
        token: newToken,
      });
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }
  }),
);

module.exports = authRouter;
