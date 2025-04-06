const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    firstName: {
        // index:true, // set index for faster access in case of large database
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,

    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email - " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please Enter a strong password");
            }
        }
    },
    age: {
        type: Number,
        min: 12
    },
    gender: {
        type: String,
        enum: {
                values: ["Male", "Female", "Others"],
                message: `{VALUE} is not a valid gender type`
            }

        // validate(value){
            // if(!["Male", "Female", "Others"].includes(value)){
            //     throw new Error("Gender value is not valid");
            // }
        // }
    },
    photoUrl: {
        type: String,
        default: "https://www.healthatlastusa.com/wp-content/uploads/2023/09/35-350426_profile-icon-png-default-profile-picture-png-transparent.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL - " + value);
            }
        }
    },
    about: {
        type: String,
        default : "This is the default about of the user",
    },
    skills: {
        type: [String],
    },
},
{
    timestamps: true
}    
);

userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.getJWT  = async function() {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", {expiresIn: "1d"});
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = this.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = {User};