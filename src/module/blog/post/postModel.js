const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
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
            type: Number,
            default: 0
        },
        dislike: {
            type: Number,
            default: 0
        },
        love: {
            type: Number,
            default: 0
        },
        reactUserId: {
            type: Array
        },
    },
    readTime: {
        type: Number
    },
    liked: {
        type: Boolean,
        default: false
    }

}, { timestamps: true, versionKey: false })

const postModel = model('posts', postSchema);

module.exports = postModel;