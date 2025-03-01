const mongoose = require("mongoose");

const { Schema  } = mongoose;

const userSchema = new Schema ({

    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
    },
    phone: {
        type: String,
    },
    interests: {
        type: [String],
    },
    bio: {
        type: String,
    },  
});

const User = mongoose.model("User", userSchema);

module.exports = User;
