const { createComment, readComment, updateComment, deleteComment } = require("./commentService");
const {  ObjectId, commentCreateSchema, commentUpdateSchema } = require("./commentValidation");

exports.createCommentController = async (req, res, next) => {
    try {
        const userId = req.user?.id ;
        const {postId} = req.params;
        const {comment } = req.body;
        const validComment = await commentCreateSchema.validateAsync({userId, postId, comment});
        const result = await createComment(validComment);
        return res.status(201).json(result);
        
    } catch (error) {
        next(error);
    }
}



exports.readCommentController = async (req, res, next) => {
    try {

        const {postId} = req.params;
        const validPostId = await ObjectId.validateAsync(postId);
        const {currentPage, pageSize} = req.query;
        const result = await readComment(validPostId, currentPage, pageSize);
        return res.status(200).json(result);
        
    } catch (error) {
        next(error);
    }
}



exports.updateCommentController = async (req, res, next) => {
    try {

        const {commentId} = req.params;
        const userId = req.user?.id
        const { comment} = req.body;
        const post = {userId, commentId, comment}

        const validPost = await commentUpdateSchema.validateAsync(post);
        const result = await updateComment(validPost);
        return res.status(201).json(result);
        
    } catch (error) {
        next(error);
    }
}



exports.deleteCommentController = async (req, res, next) => {
    try {

        const userId = req.user?.id
        const {commentId} = req.params;
        const result = await deleteComment(userId, commentId);
        return res.status(201).json(result);
        
    } catch (error) {
        next(error);
    }
}
