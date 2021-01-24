const Product = require("../model/Product");

function findProducts(req, res) {
    let page = req.query.page || 0;
    page = Number(page);
    Product.find({ "available": true })
        .skip(page)
        .limit(5)
        .populate('category', 'description')
        .populate('user', 'nombre email ')
        .exec((err, products) => {
            if (err) throw err;
            return res.status(200).json({
                status: "ok",
                products
            });
        });
}

function findProductById(req, res) {
    const _id = req.params["id"];
    Product.findById({ _id })
        .populate('category', 'description')
        .populate('user', 'nombre email ')
        .exec((err, product) => {
            if (err) throw err;
            if (!product) {
                return res.status(404).json({
                    title: "Resource Not Found",
                    status: 404,
                    detail: `Product with id ${id} not found`,
                    timestamp: Date.now()
                });
            }
            if (product) {
                return res.status(200).json({
                    product
                });
            }
        });
}

function createProduct(req, res) {
    const payload = req.body;
    const product = new Product({
        nombre: payload.nombre,
        precioUni: payload.precioUni,
        description: payload.description,
        available: payload.available,
        category: payload.category,
        user: req.user._id
    });
    product.save((err, newProduct) => {
        if (err) {
            return res.status(400).json({
                title: "Bad Request",
                status: 400,
                detail: err,
                timestamp: Date.now()
            });
        }
        return res.status(201).json({
            status: "ok",
            message: "Product successful created",
            product: newProduct
        });
    });
}

function updateProduct(req, res) {
    const id = req.params["id"];
    const payload = req.body;
    Product.findByIdAndUpdate({ "_id": id }, payload, { new: true, runValidators: true }, (err, product) => {
        if (err) {
            return res.status(400).json({
                title: "Bad Request",
                status: 400,
                detail: err,
                timestamp: Date.now()
            });
        }
        if (!product) {
            return res.status(404).json({
                title: "Resource Not Found",
                status: 404,
                detail: `Product with id ${id} not found`,
                timestamp: Date.now()
            });
        }
        return res.status(200).json({
            status: "ok",
            message: "product successful updated",
            product
        });
    });
}

function deleteProduct(req, res) {
    const id = req.params["id"];
    Product.findByIdAndDelete({ "_id": id }, (err, product) => {
        if (err) {
            return res.status(400).json({
                title: "Bad Request",
                status: 400,
                detail: err,
                timestamp: Date.now()
            });
        }
        if (!product) {
            return res.status(404).json({
                title: "Resource Not Found",
                status: 404,
                detail: `Product with id ${id} not found`,
                timestamp: Date.now()
            });
        }
        return res.status(200).json({
            status: "ok",
            message: "Product successful deleted",
            product
        });
    });
}

module.exports = {
    findProducts,
    findProductById,
    createProduct,
    updateProduct,
    deleteProduct
}
