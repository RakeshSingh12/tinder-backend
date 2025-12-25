const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ApiError } = require("./errorHandler");
const { asyncHandler } = require("./errorHandler");

// middleware to authenticate user
const userAuth = asyncHandler(async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new ApiError(401, "Please login to access this resource");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded._id) {
      throw new ApiError(401, "Invalid token");
    }

    // Find user and check if still exists
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (!user.isActive) {
      throw new ApiError(401, "User account is deactivated");
    }

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save({ validateBeforeSave: false });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired");
    }
    throw error;
  }
});

// Optional authentication middleware (doesn't throw error if no token)
const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded && decoded._id) {
        const user = await User.findById(decoded._id).select("-password");
        if (user && user.isActive) {
          user.lastActive = new Date();
          await user.save({ validateBeforeSave: false });
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
});

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Please login to access this resource"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You don't have permission to access this resource"),
      );
    }

    next();
  };
};

module.exports = {
  userAuth,
  optionalAuth,
  authorize,
};
