const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema  } = mongoose;

const userSchema = new Schema ({

    firstName: {
        type: String,
        required : true,
        minLength : 2,
        mexlength : 50,
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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email must be a valid email address "+ value);
            }
        }

    },
    password: {
        type: String,
        required : true,
        trim : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password must be a strong password "+ value);
            }
        }
    },
    age: {
        type: Number,
        min : 18,
        max : 99,
    },
    photoURL : {
        type: String,
        default : "https://m.media-amazon.com/images/I/51XRLPu0HWL._AC_UF894,1000_QL80_.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL must be a valid URL "+ value);
            }
        }
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
        validate(value){
            if(!validator.isMobilePhone(value, 'en-US')){
                throw new Error("Phone number must be a valid US phone number "+ value);
            }
        }
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

userSchema.methods.getJWT = async function () {
       const user = this;
       const token =  await jwt.sign({_id : user._id,}, "DEV@Tinder$97521", {expiresIn: "7d"})
       return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordIsValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordIsValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
