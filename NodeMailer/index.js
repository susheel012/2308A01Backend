const nodemailer = require("nodemailer");
const dotenv = require('dotenv')
dotenv.config();
const transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILER_MAIL,
        pass: process.env.MAILER_APP_PASS
    }
})

module.exports = transport;