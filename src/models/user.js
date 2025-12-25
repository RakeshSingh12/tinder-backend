const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const { Schema } = mongoose;

// This is the user schema for the user collection in MongoDB.
// It defines the structure of the user documents that will be stored in the database.

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [2, "First name must be at least 2 characters"],
      maxLength: [50, "First name cannot exceed 50 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: [50, "Last name cannot exceed 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: validator.isStrongPassword,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [99, "Age cannot exceed 99"],
    },
    photoURL: {
      type: String,
      default:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      validate: {
        validator: validator.isURL,
        message: "Please provide a valid URL for photo",
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female, or other",
      },
    },
    phone: {
      type: String,
      validate: {
        validator: function (value) {
          return validator.isMobilePhone(value, "en-US");
        },
        message: "Please provide a valid US phone number",
      },
    },
    about: {
      type: String,
      default: "This is the default description of the user",
      maxLength: [500, "About cannot exceed 500 characters"],
    },
    skills: {
      type: [String],
      validate: {
        validator: function (skills) {
          return skills.length <= 20; // Limit to 20 skills
        },
        message: "Skills cannot exceed 20 items",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields to the schema
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound indexes for better query performance
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ age: 1, gender: 1 });
userSchema.index({ isActive: 1, lastActive: -1 });
userSchema.index({ skills: 1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update lastActive
userSchema.pre("save", function (next) {
  this.lastActive = new Date();
  next();
});

/* Reusable method getJWT() */
// This method generates a JWT token for the user.
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
  return token;
};

/* Reusable method validatePassword(parms) */
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordIsValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  return isPasswordIsValid;
};

// Instance method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
