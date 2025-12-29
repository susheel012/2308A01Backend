const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "registers"
    },
    CartItems: [{
        ProductId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }]
})

const CartModel = mongoose.model("Cart", CartSchema);
module.exports = CartModel;