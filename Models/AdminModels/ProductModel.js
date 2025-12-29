const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    ProductImage: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    saleprice: {
        type: Number
    },
    totalStock: {
        type: Number,
        required: true
    },
}, {timestamps: true});

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;
