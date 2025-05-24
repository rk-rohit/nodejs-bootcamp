const mongoose =  require("mongoose");

const productSchema = new mongoose.Schema(({
    name: {
        type: String,
        required: [true, 'Product name is required.'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        default: 4,
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    createdAt : {
        type: Date,
        default: Date.now()
    }
}));

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;