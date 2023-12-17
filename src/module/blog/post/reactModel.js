/**
 * @category Post
 * @module ReactModel
 * @author Ali Rafat
*/

const { Schema, model } = require('mongoose');

const reactSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'blogs',
        required: true
    },
    react: {
        type: String,
        enum: ['like', 'fire', 'love', 'none'],
        default: 'none'
    }
}, { timestamps: true, versionKey: false });

const reactModel = model('react', reactSchema);

module.exports = reactModel;

