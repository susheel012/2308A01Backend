const express = require('express');

const {FetchAllProducts, FindProductForDetails} = require("../../Controllers/UserControllers/ProductController");

const routes = express.Router();

routes.get("/get", FetchAllProducts);
routes.get("/get/:id", FindProductForDetails);

module.exports = routes;