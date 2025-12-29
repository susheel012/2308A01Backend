const CartModel = require("../../Models/UserModels/CartModel");
const ProductModel = require("../../Models/AdminModels/ProductModel");
const UserModel = require("../../Models/UserModel");

const AddProductInCart = async (req, res) => {
    const { UserId, ProductId, quantity } = req.body;
    try {

        if (!UserId || !ProductId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided"
            })
        }

        const FindUserInCol = await UserModel.findById(UserId);
        if (!FindUserInCol) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        const FindProductWithId = await ProductModel.findById(ProductId);
        if (!FindProductWithId) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const FindCart = await CartModel.findOne({ UserId })
        if (FindCart) {
            let FindIndexOfProductInCart = FindCart.CartItems.findIndex(p => p.ProductId.toString() === ProductId);
            console.log(FindIndexOfProductInCart);
            if (FindIndexOfProductInCart > -1) {
                FindCart.CartItems[FindIndexOfProductInCart].quantity += quantity;
            } else {
                FindCart.CartItems.push({ ProductId, quantity })
            }
            await FindCart.save();

        } else {
            const Cart = new CartModel({
                UserId,
                CartItems: [{ ProductId, quantity }]
            })
            await Cart.save();
        }

        return res.status(200).json({
            success: true,
            message: "Product add to cart successfully"
        })

    } catch (e) {
        console.log(`Error: ${e}`);
    }
}
const FetchProductFromCart = async (req, res) => {
    const UserId = req.params.id;
    try {
        let FindCartWithUserId = await CartModel.findOne({ UserId }).populate("CartItems.ProductId");
        if (!FindCartWithUserId) {
            return res.status(401).json({
                success: false,
                message: "Cart not found"
            })
        }
        return res.json({
            success: true,
            FindCartWithUserId
        });

    } catch (e) {
        console.log(`Error: ${e}`);
    }
}
const UpdateProductInCart = async (req, res) => {

    const { UserId, ProductId, quantity } = req.body;
    try {

        let FindCart = await CartModel.findOne({ UserId });
        if (!FindCart) {
            return res.status(400).json({
                success: false,
                message: "Cart not found"
            })
        }

        const FindIndex = await FindCart.CartItems.findIndex(i => i.ProductId.toString() === ProductId);
        if (FindIndex > -1) {
            if (quantity > 0) {
                FindCart.CartItems[FindIndex].quantity = quantity;
                await FindCart.save();
                return res.status(200).json({
                    success: true,
                    message: "Product update successfully"
                })
            } else {
                const FilterCart = FindCart.CartItems.filter(i => i.ProductId.toString() !== ProductId);
                FindCart.CartItems = FilterCart;
                await FindCart.save();
                return res.status(200).json({
                    success: true,
                    message: "Product update successfully"
                })
            }
        } else {
            return res.status(404).json({
                success: true,
                message: "Product not found"
            })
        }
    } catch (e) {
        console.log(`Error: ${e}`);
    }
}
const DeleteProductFromCart = async (req, res) => {
    const { UserId, ProductId } = req.body;
    try {
        const FindCart = await CartModel.findOne({ UserId });
        if (!FindCart) {
            return res.status(400).json({
                success: false,
                message: "Cart not found"
            })
        }

        const FilterProducts = await FindCart.CartItems.filter(i => i.ProductId.toString() !== ProductId);
        FindCart.CartItems = FilterProducts;
        await FindCart.save();
        return res.status(200).json({
            success: true,
            message: "Items deleted succesffully"
        })

    } catch (e) {
        console.log(`Error: ${e}`);
    }
}

module.exports = { AddProductInCart, FetchProductFromCart, UpdateProductInCart , DeleteProductFromCart}