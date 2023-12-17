const postModel = require("./postModel");
const reactModel = require("./reactModel");

/**
 * Finds a react entry in the reactModel collection based on the given postId and userId.
 *
 * @param {string} postId - The ID of the post.
 * @param {string} userId - The ID of the user.
 * @return {Promise<string>} The react value found in the reactModel collection, or undefined if not found.
 */

exports.checkReactService = async (postId, userId) => {

    const result = await reactModel.findOne({ postId, userId });

    return result?.react;
};

/**
 * Updates the react service with the given parameters.
 *
 * @param {string} postId - The ID of the post.
 * @param {string} userId - The ID of the user.
 * @param {string} curReact - The current react value.
 * @param {string} preReact - The previous react value.
 * @returns {Object} An object indicating the success of the update and additional data if available.
 */

exports.updateReactService = async (postId, userId, curReact, preReact) => {
    if (curReact === preReact) {
        await reactModel.findOneAndUpdate(
            { postId, userId },
            { react: 'none' }
        )

        return { success: true, message: 'react updated', }
    } else {
        const updated = await reactModel.findOneAndUpdate(
            { postId, userId },
            { react: curReact },
            { new: true }
        )

        return { success: true, data: updated }
    }
};

/**
 * Updates the React count service.
 *
 * @param {string} postId - The ID of the post.
 * @param {string} userId - The ID of the user.
 * @param {string} curReact - The current React value.
 * @param {string} preReact - The previous React value.
 * @return {Object} An object indicating the success and a message.
 */

exports.updateReactCountService = async (postId, userId, curReact, preReact) => {

    if (curReact === preReact) {
        const previousReact = `react.${preReact}`;
        await postModel.findByIdAndUpdate(
            postId,
            { $inc: { [previousReact]: -1 } },
        )
        await reactModel.findOneAndUpdate(
            { postId, userId },
            { react: 'none' })
        await postModel.findByIdAndUpdate(postId,
            { $pull: { 'react.reactUserId': userId } }
        )
        return { success: true, message: 'react updated' }
    } else {
        const currentReact = `react.${curReact}`;
        const previousReact = `react.${preReact}`;

        await postModel.findByIdAndUpdate(
            postId,
            { $inc: { [currentReact]: 1, [previousReact]: -1 } },
        )
        await postModel.findByIdAndUpdate(postId,
            { $push: { 'react.reactUserId': userId } }
        )

        return { success: true, message: 'react updated' }
    }

};

/**
 * Creates a React service.
 *
 * @param {number} postId - The ID of the post.
 * @param {number} userId - The ID of the user.
 * @param {string} react - The react to be created.
 * @return {object} The created react.
 */

exports.createReactService = async (postId, userId, react) => {
    const created = await reactModel.create({ postId, userId, react })

    return { success: true, data: created }
};