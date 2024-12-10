const mongoose = require('mongoose');
const Category = require("./Category");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Category,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL of the image
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
