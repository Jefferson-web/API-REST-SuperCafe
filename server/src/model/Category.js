const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    description: { type: String, required: [true, 'Description is required'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    collection: 'categories'
});

module.exports = mongoose.model('Category', categorySchema);