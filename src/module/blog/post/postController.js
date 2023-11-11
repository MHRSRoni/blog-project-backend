const { createPostService, updatePostService, readPostService, deletePostService } = require("./postService");
const { postValidationSchema } = require("./postValidationSchema")


exports.createPostController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postData = await postValidationSchema.validateAsync(req.body);

        const result = await createPostService(userId, postData);

        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
};

exports.readPostController = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const result = await readPostService(slug);

        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
};

exports.updatePostController = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const postData = await postValidationSchema.validateAsync(req.body);

        const result = await updatePostService(slug, postData);

        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
};

exports.deletePostController = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const result = await deletePostService(postId);

        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
};