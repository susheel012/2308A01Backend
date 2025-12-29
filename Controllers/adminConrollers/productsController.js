const { UploadImageOnCloudinary } = require('../../Cloudinary/config');

const cloudinary = require('cloudinary').v2;

const ProductModel = require('../../Models/AdminModels/ProductModel');


//Method for generate the URL for cloudinary

const CreateUrlForImage = async (req, res) => {
    try {
        const Base64 = Buffer.from(req.file.buffer).toString('base64');
        const url = "data:" + req.file.mimetype + ";base64," + Base64;
        const GenerateUrl = await UploadImageOnCloudinary(url);

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            GenerateUrl
        })

    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }

}

//Method for add product in mongo

const AddProduct = async (req, res) => {
    const { ProductImage, title, description, category, brand, price, saleprice, totalStock } = req.body;
    try {
        if (!ProductImage || !title || !description || !category || !brand || !price || !totalStock) {
            return res.status(200).json({
                success: false,
                message: "All fields are required"
            })
        }
        if (saleprice && saleprice > price) {
            return res.status(200).json({
                success: false,
                message: "Sale price should be less than main price"
            })
        }
        const NewProduct = new ProductModel({
            ProductImage,
            title,
            description,
            category,
            brand,
            price,
            saleprice,
            totalStock
        })
        await NewProduct.save();
        res.status(200).json({
            success: true,
            message: "Product Add Successfully"
        })
    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

//FetchAll Products
const FetchAllProducts = async (req, res) => {
    try {

        const Products = await ProductModel.find();
        res.status(200).json({
            success: true,
            message: "Here is your products",
            AllProducts: Products
        })

    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

//Fetch Single product with ID

const FetchProductWithId = async (req, res) => {
    try {
        const ProductID = req.params.productid;
        const Product = await ProductModel.findById(ProductID);
        if (!Product) {
            return res.status(200).json({
                success: false,
                message: "Product Not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Product",
            Product
        })
    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

//Update Product

const UpdateProductWithId = async (req, res) => {
    const { ProductImage, title, description, category, brand, price, saleprice, totalStock } = req.body;
    try {
        if (!ProductImage || !title || !description || !category || !brand || !price || !totalStock) {
            return res.status(200).json({
                success: false,
                message: "All fields are required"
            })
        }
        const ProductId = req.params.id;

        const findProduct = await ProductModel.findById(ProductId);
        const BreakUrl = findProduct.ProductImage.split("/");
        const extractLastPart = BreakUrl[BreakUrl.length - 1];
        const ExactImageNameWithExt = extractLastPart.split(".")[0];

        await cloudinary.uploader.destroy(ExactImageNameWithExt);

        const UpdatedProduct = await ProductModel.findByIdAndUpdate(ProductId, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            UpdatedProduct
        })
    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

//Delete Products

const DeleteProductWithId = async (req, res) => {
    try {
        const ID = req.params.id;

        const findProduct = await ProductModel.findById(ID);
        const BreakUrl = findProduct.ProductImage.split("/");
        const extractLastPart = BreakUrl[BreakUrl.length - 1];
        const ExactImageNameWithExt = extractLastPart.split(".")[0];

        cloudinary.uploader.destroy(ExactImageNameWithExt);

        await ProductModel.findByIdAndDelete(ID);
        return res.status(200).json({
            success: true,
            message: "Product Deleted Succesfully"
        })
    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

module.exports = { CreateUrlForImage, AddProduct, FetchAllProducts, FetchProductWithId, UpdateProductWithId, DeleteProductWithId };