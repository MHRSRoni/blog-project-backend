const { Schema, model } = require('mongoose');

const reactSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    react: {
        type: String,
        enum: ['like', 'dislike', 'love', 'none'],
        default: 'none'
    }
}, { timestamps: true, versionKey: false });

const reactModel = model('react', reactSchema);

module.exports = reactModel;

