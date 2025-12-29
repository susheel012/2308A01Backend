const express = require('express');

const {CreateUrlForImage, AddProduct, FetchAllProducts, FetchProductWithId, UpdateProductWithId, DeleteProductWithId} = require('../../Controllers/adminConrollers/productsController');

const {uploadStorage} = require("../../Cloudinary/config")

const route = express.Router();

route.post('/generate-url', uploadStorage.single("ProductImage"), CreateUrlForImage);
route.post('/addProduct', AddProduct);
route.get('/fetch', FetchAllProducts);
route.get("/fetch/:productid", FetchProductWithId)
route.put("/fetch/:id", UpdateProductWithId)
route.delete("/fetch/:id", DeleteProductWithId)

module.exports = route;