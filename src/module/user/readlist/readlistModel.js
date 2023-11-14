const {Schema, model} = require('mongoose')

const readlistSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'user',
        required : true,
    },
    postId : {
        type : Schema.Types.ObjectId,
        ref : 'blog',
        required : true,
    }
},{timestamps : true , versionKey : false});


const readlistModel = model('readlist', readlistSchema);

module.exports = readlistModel