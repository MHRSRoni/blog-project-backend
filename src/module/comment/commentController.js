const { createComment, readComment, updateComment, deleteComment } = require("./commentService");
const { commentSchema, ObjectId } = require("./commentValidation");

exports.createCommentController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const {comment, postId} = req.body;
        const validComment = commentSchema.validateAsync({userId, postId, comment});
        const result = await createComment(validComment);
        return res.status(201).json(result);
        
    } catch (error) {
        next(error);
    }
}



exports.readCommentController = async (req, res, next) => {
    try {

        const {postId} = req.body;
        const validPostId = ObjectId.validateAsync(postId);
        const result = await readComment(validPostId, currentPage, pageSize);
        return res.status(201).json(result);
        
    } catch (error) {
        next(error);
    }
}



exports.updateCommentController = async (req, res, next) => {
    try {

        const userId = req.user?.id
        const {postId, comment} = req.body;
        const post = {userId, postId, comment}
        const validPost = commentSchema.validateAsync(post);
        const result = await updateComment(validPost);
        return res.status(201).json(result);
        
    } catch (error) {
        next(error);
    }
}



exports.deleteCommentController = async (req, res, next) => {
    try {

        const userId = req.user?.id
        const {postId} = req.body;
        const result = await deleteComment(userId, postId);
        return res.status(201).json(result);
        
    } catch (error) {
        next(error);
    }
}