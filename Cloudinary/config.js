const cloudinary = require('cloudinary').v2;

const dotenv = require("dotenv");
dotenv.config()
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
})

const Storage = new multer.memoryStorage({});

async function UploadImageOnCloudinary(file){
    const finalUploadImage = await cloudinary.uploader.upload(file, {
        resource_type: "auto"
    })
    return finalUploadImage;
}

const uploadStorage = multer({Storage});
module.exports = {uploadStorage, UploadImageOnCloudinary}