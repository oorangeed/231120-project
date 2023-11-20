const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
        password: { type: String, required: true },
        status: { type: String, enum: ["FOR_SALE", "SOLD_OUT"], default: "FOR_SALE" },
    },
    { timestamps: true } // "createdAt": "2023-10-15T04:09:42.059Z"

);

const Product = mongoose.model("Product", schema);
module.exports = Product;
