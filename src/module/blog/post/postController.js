/**
 * @category Post
 * @module PostController
 * @author Ali Rafat
*/

const { createPostService, updatePostService, deletePostService, readSinglePostService, readAllPostService, searchPostService, readRelevantPostService, } = require("./postService");
const { reactValidationSchema } = require("./postValidationSchema");
const { checkReactService, updateReactService, updateReactCountService, createReactService } = require("./reactService");

/**
 * Create a new post.
 * @description 
 * - This function [validate the userId and post data]{@link module:PostValidation~validateCreatePostData} 
 * - call the [createPost]{@link module:PostService~createPostService} service with resulted Object.
 * - Then the result of the [createPost]{@link module:PostService~createPostService} service is send in response as json.
 * @async
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {String} req.body.categoryId - The category id.
 * @param {String} req.body.title - The title of the post.
 * @param {String} req.body.description - The description of the post.
 * @param {String} req.body.picture - The picture of the post.
 * @param {Object} req.user - The user object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The result of creating the post.
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
 * @description 
 * - When the user is giving the slug parameter, call the [readSinglePostService]{@link module:PostService~readSinglePostService} service with resulted Object.
 * - Then the result of the [readSinglePostService]{@link module:PostService~readSinglePostService} service is send in response as json.
* - When the user is giving relevant as a sort parameter, call the [readRelevantPostService]{@link module:PostService~readRelevantPostService} service with resulted Object.
 * - Then the result of the [readRelevantPostService]{@link module:PostService~readRelevantPostService} service is send in response as json.
 * - When the user is giving relevant as a sort parameter, call the [readRelevantPostService]{@link module:PostService~readRelevantPostService} service with resulted Object.
 * @async
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {String} req.query.sort - The sort parameter.
 * @param {String} req.query.slug - The slug parameter.
 * @param {String} req.query.category - The category parameter.
 * @param {String} req.query.user - The user parameter.
 * @param {String} req.query.search - The search parameter.
 * @param {String} req.query.page - The page parameter.
 * @param {String} req.query.limit - The limit parameter.
 * @param {Object} req.user - The user object.
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