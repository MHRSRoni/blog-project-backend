const { createPostService, updatePostService, deletePostService, readSinglePostService, readAllPostService, searchPostService, readRelevantPostService, } = require("./postService");
const { reactValidationSchema } = require("./postValidationSchema");
const { checkReactService, updateReactService, updateReactCountService, createReactService } = require("./reactService");

/**
 * Create a new post.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise} The result of creating the post.
 */

exports.createPostController = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        const result = await createPostService(userId, req.body);

        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
};

/**
 * Reads a post based on the provided query parameters.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The result of reading the post.
 */

exports.readPostController = async (req, res, next) => {
    try {
        const { sort, slug, search, category, user } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const email = req.user?.email || null;
        const userId = req.user?.id;

        let result;

        if (slug) {
            result = await readSinglePostService(slug);
        } else if (sort === 'relevant') {
            result = await readRelevantPostService(page, limit, email);
        } else if (category) {
            result = await searchPostService(page, limit, search, { categoryId: category });
        } else if (user) {
            result = await searchPostService(page, limit, search, { userId: user })
        } else if (search) {
            result = await searchPostService(page, limit, search)
        } else {
            result = await readAllPostService(userId, page, limit, sort);
        }

        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
};

/**
 * Updates a post.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @return {Promise} The updated post object as a JSON response.
 */

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

/**
 * Deletes a post.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @return {object} The JSON response containing the result of the deletion.
 */

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

/**
 * Updates the React controller.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise} A promise that resolves to the updated React controller.
 */

exports.updateReactController = async (req, res, next) => {
    try {
        const { postId, react } = req.params;
        const userId = req?.user?.id;

        const validReact = await reactValidationSchema.validateAsync(react);

        const existingReact = await checkReactService(postId, userId);

        if (existingReact) {
            const result = await updateReactService(postId, userId, validReact, existingReact);

            await updateReactCountService(postId, userId, validReact, existingReact);

            return res.status(200).json(result)

        } else {
            const result = await createReactService(postId, userId, validReact);

            await updateReactCountService(postId, userId, validReact, existingReact);

            return res.status(200).json(result);
        }

    } catch (error) {
        next(error)
    }
};