const { findProducts, findProductById, createProduct, updateProduct, deleteProduct } = require('../controller/productController');
const Router = require('express');
const { verifyToken } = require('../utils/authorization');

class ProductRoutes {

    constructor() {
        this.__router = Router();
        this.config();
    }

    config() {
        this.__router.get('/', [verifyToken, findProducts]);
        this.__router.get('/:id', [verifyToken, findProductById]);
        this.__router.post('/', [verifyToken, createProduct]);
        this.__router.put('/:id', [verifyToken, updateProduct]);
        this.__router.delete('/:id', [verifyToken, deleteProduct]);
    }

}

const productRoutes = new ProductRoutes();
module.exports = productRoutes.__router;