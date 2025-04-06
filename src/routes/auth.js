const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/Validate");
const {User} = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    try{
        // Validation of data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // creating a new instance of the user model
        const user = new User({
            firstName, lastName, emailId, password: passwordHash,
        });

        const savedUser = await user.save();
        // create a JWT token and set expiry time for the token
        const token = await savedUser.getJWT();

        // add the token to cookie, set the expiry time for cookie and send the response back to the user
        res.cookie('token', token, {expires: new Date(Date.now() + 24*60*60*1000)});
        res.json({message: "User data added successfully", data: savedUser});
    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials");


        }
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            // create a JWT token and set expiry time for the token
            const token = await user.getJWT();

            // add the token to cookie, set the expiry time for cookie and send the response back to the user
            res.cookie('token', token, {expires: new Date(Date.now() + 24*60*60*1000)});
            res.send(user);
        }
        else{
            throw new Error("Invalid Credentials");
        }
    } catch (err){
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
    });
    res.send("Logged out successfully");
});

module.exports = authRouter;

