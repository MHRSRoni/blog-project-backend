const { createPostService, updatePostService, deletePostService, readSinglePostService, readAllPostService, likeDislikePostService, searchPostService } = require("./postService");
const { postValidationSchema, reactValidationSchema } = require("./postValidationSchema");
const { checkReactService, updateReactService, updateReactCountService, createReactService } = require("./reactService");


exports.createPostController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
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

exports.likeDislikePostController = async (req, res, next) => {
    try {
        const { react } = req.body;
        const { slug } = req.params;

        const result = await likeDislikePostService(slug, react);

        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
};

exports.updateReactController = async (req, res, next) => {
    try {
        const { postId, react } = req.params;
        const userId = req.user.id;

        const validReact = await reactValidationSchema.validateAsync(react);

        const existingReact = await checkReactService(postId, userId);

        if (existingReact) {
            const result = await updateReactService(postId, userId, validReact);

            await updateReactCountService(postId, validReact, existingReact);

            return res.status(200).json(result)

        }

        const result = await createReactService(postId, userId, validReact);

        await updateReactCountService(postId, validReact, existingReact);

        return res.status(200).json(result);

    } catch (error) {
        next(error)
    }
};

exports.searchPostController = async (req, res, next) => {
    try {
        const { search } = req.query || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const result = await searchPostService(page, limit, search);

        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}