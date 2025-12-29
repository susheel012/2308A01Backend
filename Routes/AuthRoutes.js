const express = require('express');
//Controller

const {UserRegister, LoginUser, AuthMiddleware, LogoutUser, OtpVerification, RegenerateOtp, FindUserWithEmail, ForgetPassword} = 
require('../Controllers/authentication/AuthController')

const route = express.Router();

route.post('/register', UserRegister);
route.post('/login', LoginUser);
route.post('/logout', LogoutUser);
//auth middleware
route.get('/checkUser', AuthMiddleware, async(req, res) => {
    const user = req.user;
    return res.status(200).json({
        success: true,
        user
    })
})

route.post("/otp-verify", OtpVerification);
route.post("/otp-regnerate", RegenerateOtp);

route.post("/find", FindUserWithEmail);
route.post("/forget", ForgetPassword);
module.exports = route;