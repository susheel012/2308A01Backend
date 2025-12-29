const express = require('express');
const bcrypt = require('bcryptjs');

//JWT TOKEN
const jwt = require('jsonwebtoken');

const User = require('../../Models/UserModel');

const transport = require("../../NodeMailer/index");

//Methods => register => login => middleware

const UserRegister = async (req, res) => {
    // const USername = req.body.USername;
    // const USeremail = req.body.USeremail;
    // const USerpassword = req.body.USerpassword;

    const { UserName, UserEmail, UserPassword } = req.body;
    try {
        //All fields validate
        if (!UserName || !UserEmail || !UserPassword) return res.json({
            success: false,
            message: "All fields are required"
        })

        const CheckEmail = await User.findOne({ UserEmail })
        if (CheckEmail) {
            return res.json({
                success: false,
                message: "User already exists"
            })
        }
        const randomOtp = Math.floor(1000 + Math.random() * 8999);
        const hashedPassword = await bcrypt.hash(UserPassword, 11);

        const countCollection = await User.countDocuments();
        const DefineRole = countCollection === 0 ? "admin" : "user";

        const RegisterUser = new User({
            UserName,
            UserEmail,
            UserPassword: hashedPassword,
            UserRole: DefineRole,
            OTP: randomOtp,
            OtpExpireTime: new Date(Date.now() + (3 * 60 * 1000))
        })

        await RegisterUser.save();

        transport.sendMail({
            from: "testemailsmtp1236@gmail.com",
            to: UserEmail,
            subject: "Otp - verification",
            text: `Your one time password is: ${randomOtp}`
        })

        res.status(200).json({
            success: true,
            message: "Register successfully"
        })
    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Issue found"
        })
    }
}

const LoginUser = async (req, res) => {
    const { UserEmail, UserPassword } = req.body;

    try {
        //All fields validate
        if (!UserEmail || !UserPassword) return res.json({
            success: false,
            message: "All fields are required"
        })

        const checkUser = await User.findOne({ UserEmail });
        if (!checkUser) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        const decodePassword = await bcrypt.compare(UserPassword, checkUser.UserPassword);
        if (!decodePassword) {
            return res.json({
                success: false,
                message: "Password Incorrect"
            })
        }

        if (checkUser.isVerified === "pending") {
            return res.json({
                success: false,
                message: "User is not verified"
            })
        }

        const token = jwt.sign(
            {
                id: checkUser._id,
                email: checkUser.UserEmail,
                role: checkUser.UserRole,
                name: checkUser.UserName
            },
            "CLIENT_SECRET_KEY",
            {
                expiresIn: "1h"
            }
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: false
        }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                id: checkUser._id,
                email: checkUser.UserEmail,
                role: checkUser.UserRole,
                name: checkUser.UserName
            }
        })

    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server not responding"
        })
    }
}

const OtpVerification = async (req, res) => {
    const { UserEmail, OTP } = req.body;
    try {

        const CheckUser = await User.findOne({ UserEmail })
        if (!CheckUser) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        if (CheckUser.OtpExpireTime < Date.now()) {
            return res.json({
                success: false,
                message: "Your otp is expired"
            })
        }
        if (CheckUser.OTP != OTP) {
            return res.json({
                success: false,
                message: "Wrong OTP"
            })
        }
        CheckUser.OTP = "";
        CheckUser.OtpExpireTime = "";
        CheckUser.isVerified = "verified";

        await CheckUser.save();

        return res.json({
            success: true,
            message: "User verified successfully"
        })

    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

const RegenerateOtp = async (req, res) => {
    const { UserEmail } = req.body;
    try {
        const FindUser = await User.findOne({ UserEmail });
        if (!FindUser) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        const randomOtp = Math.floor(1000 + Math.random() * 8999);
        FindUser.OTP = randomOtp;
        FindUser.OtpExpireTime = new Date(Date.now() + (3 * 60 * 1000));
        await FindUser.save();

        transport.sendMail({
            from: "testemailsmtp1236@gmail.com",
            to: UserEmail,
            subject: "Resend - OTP",
            text: `Your New otp is: ${randomOtp}`
        })

        res.json({
            success: true,
            message: "Otp resend successfully"
        })

    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

//logout

const LogoutUser = async (req, res) => {
    res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully"
    })
}


//ForgetPassword Logic

const FindUserWithEmail = async (req, res) => {
    const { UserEmail } = req.body;
    try {
        const FindUser = await User.findOne({ UserEmail });
        if (!FindUser) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User found"
        })

    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

const ForgetPassword = async (req, res) => {
    const { UserEmail, UserPassword, cpassword } = req.body;
    try {
        const FindUserForForget = await User.findOne({UserEmail});
        if(!FindUserForForget){
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        const CheckPassword = await bcrypt.compare(UserPassword, FindUserForForget.UserPassword)
        if(CheckPassword){
            return res.json({
                success: false,
                message: "Same password is not allowed"
            })
        }

        if(UserPassword !== cpassword){
            return res.json({
                success: false,
                message: "Confirm password should be matched"
            })
        }
        const HashPassword = await bcrypt.hash(UserPassword, 12);
        FindUserForForget.UserPassword = HashPassword;
        await FindUserForForget.save();

        return res.status(200).json({
            success: true,
            message: "Forget password successfully"
        })

    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

//Middleware => hold logic => to regenrate the user's token and details

const AuthMiddleware = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(404).json({
            success: false,
            message: "Unauthorized person"
        })
    }
    try {
        const decodeToken = jwt.verify(token, "CLIENT_SECRET_KEY");
        req.user = decodeToken;
        next();
    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }

}



module.exports = { UserRegister, LoginUser, AuthMiddleware, LogoutUser, OtpVerification, RegenerateOtp, FindUserWithEmail, ForgetPassword };