const postModel = require("./postModel");
const reactModel = require("./reactModel");

exports.checkReactService = async (postId, userId) => {

    const result = await reactModel.findOne({ postId, userId });

    return result?.react;
}

exports.updateReactService = async (postId, userId, curReact, preReact) => {

    if (curReact == preReact) {
        await reactModel.findOneAndUpdate(
            { postId, userId },
            { react: 'none' })
        return { sucess: true, message: 'react updated', }
    }

    const updated = await reactModel.findOneAndUpdate(
        { postId, userId }, { react: curReact }, { new: true })


    return { success: true, data: updated }
};

exports.updateReactCountService = async (postId, curReact, preReact) => {

    if (curReact == preReact) {
        const previousReact = `react.${preReact}`;
        await postModel.findByIdAndUpdate(
            postId,
            { $inc: { [previousReact]: -1 } },
        )
        return { sucess: true, message: 'react updated' }
    }
    const currentReact = `react.${curReact}`;
    const previousReact = `react.${preReact}`;

    const value = await postModel.findByIdAndUpdate(
        postId,
        { $inc: { [currentReact]: 1, [previousReact]: -1 } },
    )

    return { success: true, data: value }
};

exports.createReactService = async (postId, userId, react) => {
    const created = await reactModel.create({ postId, userId, react })

    return { success: true, data: created }
}