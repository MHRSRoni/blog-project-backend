const {Schema, model} = require('mongoose')

const commentSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'user',
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
})


const commentModel = model('comment', commentSchema);

module.exports = commentModel