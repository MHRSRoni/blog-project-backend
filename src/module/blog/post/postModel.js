const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        type: String,
        ref: 'users',
        required: true
    },
    categoryId: {
        // type: Schema.Types.ObjectId,
        type: String,
        ref: 'categories',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    picture: {
        type: String,
        trim: true
    },
    react: {
        like: {
            type: Number
        },
        dislike: {
            type: Number
        }
    },
    readTime: {
        type: Number
    }

}, { timestamps: true, versionKey: false })

const postModel = model('posts', postSchema);

module.exports = postModel;