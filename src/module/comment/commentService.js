const createError = require("http-errors")
const giveError = require('../../utils/throwError')
const commentModel = require('./commentModel')

exports.createComment = async (userId, postId, comment) => {
    const savedComment = await new commentModel({userId, postId, comment}).save()

    if(!savedComment){
        throw giveError(
            createError(501, "comment not saved", {mode : 'development'}),
            createError(501, 'something went wrong', {mode : 'production'})
        )
    }

    return {success : true, data : savedComment}

}

exports.readComment = async ( postId, currentPage = 1, pageSize = 3) => {

    const totalComment = await commentModel.find({postId}).count()
    const totalPage = Math.ceil(totalComment / totalPage)
    const comments = await commentModel.find({postId}, {comment : 1, _id : 1})
                                .skip(pageSize * currentPage - 1)
                                .limit(pageSize)

    if(comments?.length < 1){
        throw giveError(
            createError(404, "no comment found in the database", {mode : 'development'}),
            createError(404, 'no comments, yet', {mode : 'production'})
        )
    }

    return {success : true, data : {currentPage, totalComment, totalPage, comments}}

}

exports.updateComment = async (userId, postId, comment) => {

    const savedComment = await commentModel.findOneAndUpdate({userId, postId}, {comment}, {new : true})

    if(!savedComment){
        throw giveError(
            createError(501, "comment not saved", {mode : 'development'}),
            createError(501, 'something went wrong', {mode : 'production'})
        )
    }

    return {success : true, data : savedComment}

}

exports.deleteComment = async (userId, postId) => {

    const deletedComment = await commentModel.findOneAndUpdate({userId, postId})

    if(!deletedComment){
        throw giveError(
            createError(501, "comment not deleted", {mode : 'development'}),
            createError(501, 'something went wrong', {mode : 'production'})
        )
    }

    return {success : true, data : deletedComment}

}