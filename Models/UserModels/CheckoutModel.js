const mongoose = require('mongoose');

const CheckoutSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Register"
    },
    CartItems : [
        {
            ProductId : {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            quantity : {
                type: Number,
                required: true
            },
            Status: {
                type: String,
                default: "pending"
            }
        }
    ],
    address: {
        type: String,
        required: true
    },
    totalAmount : {
        type: Number,
        required: true
    },
    Status: {
        type: String,
        default: "Pending"
    },
    purchaseAt : {
        type: Date,
        default: Date.now
    },
    Payment : {
        type: String,
        default: "COD"
    }
})

const CheckoutModel = mongoose.model("Checkout", CheckoutSchema);
module.exports = CheckoutModel;