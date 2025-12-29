const ProductModel = require("../../Models/AdminModels/ProductModel");


const FetchAllProducts = async (req, res) => {
    try {
        const { category = [], brand = [], sortBy = "Price lowtohigh" } = req.query;

        let filters = {};
        if (category.length) {
            filters.category = { $in: category.split(",") }
        }
        if (brand.length) {
            filters.brand = { $in: brand.split(",") }
        }

        let sort = {};

        switch (sortBy) {
            case "Price lowtohigh":
                sort.price = 1;
                break;
            case "Price highttolow":
                sort.price = -1;
                break;
            case "OrdersA to Z":
                sort.title = 1;
                break;
            case "OrdersZ to A":
                sort.title = -1;
                break;
        }
        const Fetch = await ProductModel.find(filters).sort(sort);
        res.status(200).json({
            success: true,
            message: "Fetched",
            AllProducts: Fetch
        })
    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

const FindProductForDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const FindProducts = await ProductModel.findById(id);
        if(!FindProducts){
            return res.json({
                success: false,
                message: "product not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: FindProducts
        })

    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(500).json({
            success: false,
            message: "Server issue"
        })
    }
}

module.exports = { FetchAllProducts, FindProductForDetails };