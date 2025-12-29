const CheckoutModel = require("../../Models/UserModels/CheckoutModel");
const CartModel = require("../../Models/UserModels/CartModel");

const Checkout = async (req, res) => {
    const { UserId, totalAmount, address } = req.body;
    try {

        if (!UserId || !totalAmount) {
            return res.status(404).json({
                success: false,
                message: "Invalid data"
            })
        }

        const FindCartWithId = await CartModel.findOne({ UserId }).populate("CartItems.ProductId");
        if (!FindCartWithId) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            })
        }

        const checkoutFinal = new CheckoutModel({
            UserId,
            CartItems: FindCartWithId.CartItems.map((e) => ({ ProductId: e.ProductId._id, quantity: e.quantity })),
            address,
            totalAmount
        })
        await checkoutFinal.save();

        FindCartWithId.CartItems = [];
        await FindCartWithId.save();
        return res.status(200).json({
            success: true,
            message: "Checkout successfully!"
        })
    } catch (e) {
        console.log(`Error: ${e}`);
        return res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

const AllUsers = async (req, res) => {
    try {
        const GetUsers = await CheckoutModel.find()
            .populate("UserId", "UserName")
            .populate("CartItems.ProductId", "ProductImage title price category");
        return res.status(200).json({
            success: true,
            GetUsers
        })
    } catch (e) {
        console.log(`Error: ${e}`);
        return res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

const StatusUpdateOfProducts = async (req, res) => {
    const {CheckoutId, ProductId, Status} = req.body;
    try {
        if(!CheckoutId || !ProductId || !Status){
            return res.status(400).json({
                success: false,
                message: "Invalid data provided"
            })
        }

        const FindCheckoutCollection = await CheckoutModel.findById(CheckoutId);
        if(!FindCheckoutCollection){
            return res.status(401).json({
                success: false,
                message: "Checkout not found"
            })
        }

        const FindIndexOfProduct = await FindCheckoutCollection.CartItems.findIndex(i => i.ProductId.toString() === ProductId)
        if(FindIndexOfProduct > -1){
            FindCheckoutCollection.CartItems[FindIndexOfProduct].Status = Status
            await FindCheckoutCollection.save();
        }
        return res.status(200).json({
            success: true,
            message: "Status updated successfully"
        })
    } catch (e) {
        console.log(`Error: ${e}`);
        return res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

module.exports = { Checkout, AllUsers, StatusUpdateOfProducts };