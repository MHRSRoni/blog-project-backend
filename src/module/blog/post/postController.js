const { createPostService, updatePostService, deletePostService, readSinglePostService, readAllPostService, likeDislikePostService, searchPostService, imageUploadService, readRelevantPostService, readPostByCategoryService } = require("./postService");
const { reactValidationSchema, postCreateValidationSchema, postUpdateValidationSchema } = require("./postValidationSchema");
const { checkReactService, updateReactService, updateReactCountService, createReactService } = require("./reactService");
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;


exports.createPostController = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        const result = await createPostService(userId, req.body);

        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
};

exports.readPostController = async (req, res, next) => {
    try {
        const { sort } = req.query;
        const { slug } = req.query;
        const { search } = req.query;
        const { category } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const email = req.user?.email || null;

        let result;

        if (slug) {
            result = await readSinglePostService(slug);
        } else if (search) {
            result = await searchPostService(page, limit, search);
        } else if (sort === 'relevant') {
            result = await readRelevantPostService(page, limit, email);
        } else if (category) {
            result = await readPostByCategoryService(page, limit, category);
        }
        else {
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
        const userId = req.user?.id;

        const result = await updatePostService(slug, userId, req.body);

        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
};

exports.deletePostController = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const userId = req?.user?.id;

        const result = await deletePostService(slug, userId);

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
        const userId = req?.user?.id;

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