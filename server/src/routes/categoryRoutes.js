const Router = require('express');
const { findCategories, findCategoryById, createCategory, updateCategory, deleteCategory } = require('../controller/categoryControlller');
const { verifyToken, verifyRole } = require('../utils/authorization');

class CategoryRoutes {

    constructor() {
        this.__router = Router();
        this.config();
    }

    config() {
        this.__router.get('/', [verifyToken, findCategories]);
        this.__router.get('/:id', [verifyToken, findCategoryById]);
        this.__router.post('/', [verifyToken, createCategory]);
        this.__router.put('/:id', [verifyToken, updateCategory]);
        this.__router.delete('/:id', [verifyToken, verifyRole, deleteCategory]);
    }

}

const categoryRoutes = new CategoryRoutes();
module.exports = categoryRoutes.__router;