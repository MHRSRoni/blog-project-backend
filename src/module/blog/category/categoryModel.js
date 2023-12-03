const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
    },
    cover: {
        type: String,
        trim: true
    }
}, { timestamps: true, versionKey: false })

const categoryModel = model('categories', categorySchema);

module.exports = categoryModel