const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: [true, "El nombre es requerido"] },
    precioUni: { type: Number, required: [true, "El precio unitario es requerido"] },
    description: { type: String, required: [true, "La descripcion es requerida"] },
    available: { type: Boolean, required: true, default: true },
    img: {type: String, required: false},
    category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Product', productSchema);