const { createPostService, updatePostService, deletePostService, readSinglePostService, readAllPostService, readLatestPostService, readTopPostService } = require("./postService");
const { postValidationSchema } = require("./postValidationSchema")


exports.createPostController = async (req, res, next) => {
    try {
        const userId = 'dfgdfg';
        const postData = await postValidationSchema.validateAsync(req.body);

        const result = await createPostService(userId, postData);

        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
};

exports.readPostController = async (req, res, next) => {
    try {
        const { sort } = req.body;
        const { slug } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        let result;

        if (slug) {
            result = await readSinglePostService(slug);
        } else {
            result = await readAllPostService(page, limit, sort);
        }

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