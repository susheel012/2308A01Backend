const express = require('express');

const {Checkout, AllUsers, StatusUpdateOfProducts} = require("../../Controllers/UserControllers/CheckoutController");

const route = express.Router();

route.post("/post", Checkout);
route.get("/get", AllUsers);
route.put("/update", StatusUpdateOfProducts);

module.exports = route;