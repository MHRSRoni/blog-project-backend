/**
 * @category Readlist
 * @author MHRoni
 * @module ReadlistModel
 */


//=============Imports===============//
const { Schema, model, Model } = require('mongoose')
//==================================//


//=============Types================//
/** @typedef {import('mongoose').Types.ObjectId} ObjectID - ObjectId of the Mongoose */
/**
 * @typedef {Object} Readlist Sample of the Readlist Document
 * @property {String|ObjectID} _id - The id of the readlist
 * @property {String|ObjectID} user - The id of the user
 * @property {String|ObjectID} post - The id of the post
 * @property {Date} createdAt - The date when the readlist was created
 * @property {Date} updatedAt - The date when the readlist was updated
 */
//==================================//



//============Schema=================//
/**
 * @type {Schema<Readlist>} Readlist schema
 */
const readlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'posts',
        required: true,
    }
}, { timestamps: true, versionKey: false });

//==================================//



//=============Model=================//
/**
 * @type {Model<Readlist>} Readlist model of the user
 */
const readlistModel = model('readlist', readlistSchema);
//===================================//



//============Export=================//
module.exports = readlistModel
//==================================//