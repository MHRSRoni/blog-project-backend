const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
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
        }
    },
    readTime: {
        type: Number
    }

}, { timestamps: true, versionKey: false })

postSchema.index({ title: 'text', description: 'text' })

const postModel = model('posts', postSchema);

module.exports = postModel;