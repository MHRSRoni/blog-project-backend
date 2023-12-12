const { Schema, model, Model } = require('mongoose')

// /**
//  * @module readlist
//  */
/**
 * @module
 */

/**
 * @typedef {Object} Readlist Sample of the Readlist Document
 * @property {string} userId - The id of the user
 * @property {string} postId - The id of the post
 */


/**
 * @type {Schema<Readlist>} Readlist schema of the user
 */
const readlistSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'posts',
        required: true,
    }
}, { timestamps: true, versionKey: false });



/**
 * @type {Model<Readlist>} Readlist model of the user
 */
const readlistModel = model('readlist', readlistSchema);

module.exports = readlistModel