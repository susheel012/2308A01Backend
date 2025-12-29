const mongoose = require('mongoose');

//Schema => table's blueprint => UserName => UserEmail => UserPassword => UserRole
const UserModel = mongoose.Schema({
    UserName : {
        type: String,
        required: true
    },
    UserEmail : {
        type: String,
        required: true,
        unique: true
    },
    UserPassword : {
        type: String,
        required: true
    },
    UserRole : {
        type: String,
        default: 'user'
    },
    OTP: {
        type: Number
    },
    OtpExpireTime:{
        type: String
    },
    isVerified: {
        type: String,
        default: "pending"
    }
},{timestamps: true})

const User = mongoose.model('Register', UserModel);
module.exports = User;