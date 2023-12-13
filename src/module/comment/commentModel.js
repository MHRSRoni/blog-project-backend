/**
 * @category Comment
 * @module CommentModel
 * @author MHRoni
 */

//=============Imports===============//
const {Schema, Model, model} = require('mongoose')

//==================================//


//=============Types================//
/**@typedef {import('mongoose').Types.ObjectId} ObjectID - ObjectId of the Mongoose  */
/**
 * @typedef {Object} Comment Sample of the Comment Document
 * @property {String|ObjectID} _id - The id of the comment
 * @property {String|ObjectID} user - The id of the user
 * @property {String|ObjectID} post - The id of the post
 * @property {String} comment - The comment on the post
 * @property {Date} createdAt - The date when the comment was created
 * @property {Date} updatedAt - The date when the comment was updated
 */
//==================================//



//============Schema=================//
/**
 * @type {Schema<Comment>} Comment schema
 */
const commentSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'users',
        required : true,
    },
    post : {
        type : Schema.Types.ObjectId,
        ref : 'blog',
        required : true,
    },
    comment : {
        type : String,
        required : true,
    }
},{versionKey : false, timestamps : true})
//==================================//


//===========Model==================//
/**
 * @type {Model<Comment>} Comment model
 */
const commentModel = model('comment', commentSchema);
//==================================//



//===========Export==================//
module.exports = commentModel

//==================================//