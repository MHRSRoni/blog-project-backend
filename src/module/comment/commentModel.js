const {Schema, model} = require('mongoose')

const commentSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'users',
        required : true,
    },
    postId : {
        type : Schema.Types.ObjectId,
        ref : 'blog',
        required : true,
    },
    comment : {
        type : String,
        required : true,
    }
},{versionKey : false, timestamps : true})



const commentModel = model('comment', commentSchema);

module.exports = commentModel