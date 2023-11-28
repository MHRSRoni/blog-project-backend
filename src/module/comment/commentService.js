const createError = require("http-errors")
const giveError = require('../../utils/throwError')
const commentModel = require('./commentModel')

exports.createComment = async (validComment) => {
    const savedComment = await new commentModel({...validComment, user : validComment.userId}).save()

    if(!savedComment){
        throw giveError(
            createError(501, "comment not saved", {mode : 'development'}),
            createError(501, 'something went wrong', {mode : 'production'})
        )
    }

    return {success : true, data : savedComment}

}

exports.readComment = async ( postId, currentPage = 1, pageSize = 3) => {

    const totalComment = await commentModel.countDocuments({postId})
    const totalPage = Math.ceil(totalComment / pageSize)
    const comments = await commentModel.find({postId}, {comment : 1, _id : 1})
                                .skip(pageSize * (currentPage - 1))
                                .limit(pageSize)
                                .populate({
                                    path : 'user',
                                    select : 'name picture',
                                })
                                .sort({ updatedAt: 'desc' })
                                .exec()

    if(comments?.length < 1){
        throw giveError(
            createError(404, "no comment found in the database", {mode : 'development'}),
            createError(404, 'no comments, yet', {mode : 'production'})
        )
    }

    return {success : true, data : {currentPage, totalComment, totalPage, comments}}

}

exports.updateComment = async ({userId : user, commentId : _id, comment}) => {

    const savedComment = await commentModel.findOneAndUpdate({user, _id}, {comment : comment}, {new : true})

    if(!savedComment){
        throw giveError(
            createError(501, "comment not saved", {mode : 'development'}),
            createError(501, 'something went wrong', {mode : 'production'})
        )
    }

    return {success : true, data : savedComment}

}

exports.deleteComment = async (userId, _id) => {

    const deletedComment = await commentModel.findOneAndDelete({user : userId, _id})

    if(!deletedComment){
        throw giveError(
            createError(501, "comment not deleted", {mode : 'development'}),
            createError(501, 'something went wrong', {mode : 'production'})
        )
    }

    return {success : true, data : deletedComment}

}