const mongoose = require("mongoose");

const { Schema  } = mongoose;

const userSchema = new Schema ({

    firstName: {
        type: String,
        required : true,
        minLength : 2,
        mexlength : 50,
        unique: true,
    },
    lastName: {
        type: String,
        mexlength : 50,
    },
    email: {
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim : true,

    },
    password: {
        type: String,
        required : true,
    },
    age: {
        type: Number,
    },
    photoURL : {
        type: String,
        default : "https://m.media-amazon.com/images/I/51XRLPu0HWL._AC_UF894,1000_QL80_.jpg"
    },
    gender :{
        type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender data not valid")
        }
    }

    },
    phone: {
        type: String,
    },
    about : {
        type: String,
        default : "this is default description of the user"
    },
    skills : {
        type: [String],
    }
}, {
    timestamps : true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
