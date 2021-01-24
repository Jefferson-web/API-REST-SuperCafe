const Category = require("../model/Category");

function findCategories(req, res) {
    Category.populate
    Category.find({})
        .sort('description')
        .populate('user', 'nombre email')
        .exec((err, categories) => {
            if (err) throw err;
            return res.status(200).json({
                status: "ok",
                categories
            });
        });
}

function findCategoryById(req, res) {
    const _id = req.params["id"];
    Category.findById({ _id }, (err, category) => {
        if (err) throw err;
        if (!category) {
            return res.status(404).json({
                title: "Resource Not Found",
                status: 404,
                detail: `Category with id ${id} not found`,
                timestamp: Date.now()
            });
        }
        if (category) {
            return res.status(200).json({
                category
            });
        }
    });
}

function createCategory(req, res) {
    const category = new Category({
        description: req.body.description,
        user: req.user._id
    });
    category.save((err, newCategory) => {
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
            message: "Category successful created",
            category: newCategory
        });
    });
}

function updateCategory(req, res) {
    const id = req.params["id"];
    const description = req.body.description;
    Category.findByIdAndUpdate({ "_id": id }, { description }, { new: true, runValidators: true }, (err, category) => {
        if (err) {
            return res.status(400).json({
                title: "Bad Request",
                status: 400,
                detail: err,
                timestamp: Date.now()
            });
        }
        if (!category) {
            return res.status(404).json({
                title: "Resource Not Found",
                status: 404,
                detail: `Category with id ${id} not found`,
                timestamp: Date.now()
            });
        }
        return res.status(200).json({
            status: "ok",
            message: "Category successful updated",
            category
        });
    });
}

function deleteCategory(req, res) {
    const id = req.params["id"];
    Category.findByIdAndDelete({ "_id": id }, (err, category) => {
        if (err) {
            return res.status(400).json({
                title: "Bad Request",
                status: 400,
                detail: err,
                timestamp: Date.now()
            });
        }
        if (!category) {
            return res.status(404).json({
                title: "Resource Not Found",
                status: 404,
                detail: `Category with id ${id} not found`,
                timestamp: Date.now()
            });
        }
        return res.status(200).json({
            status: "ok",
            message: "Category successful deleted",
            category
        });
    });
}


module.exports = {
    findCategories,
    findCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}