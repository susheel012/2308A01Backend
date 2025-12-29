const express = require('express');
const {AddProductInCart, FetchProductFromCart, UpdateProductInCart, DeleteProductFromCart} = require("../../Controllers/UserControllers/CartController");

const route = express.Router();

route.post("/add", AddProductInCart);
route.get("/fetch/:id", FetchProductFromCart);
route.put("/put", UpdateProductInCart);
route.delete("/delete", DeleteProductFromCart);

module.exports = route;