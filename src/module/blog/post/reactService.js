const postModel = require("./postModel");
const reactModel = require("./reactModel");

exports.checkReactService = async (postId, userId) => {

    const result = await reactModel.findOne({ postId, userId });

    return result?.react;
}

exports.countReactService = async (postId) => {

}

exports.updateReactService = async (postId, userId, react) => {
    const updated = await reactModel.findOneAndUpdate(
        { postId, userId }, { react }, { new: true })

    return { success: true, data: updated }
};

exports.updateReactCountService = async (postId, curReact, preReact) => {

    const currentReact = `react.${curReact}`;
    const previousReact = `react.${preReact}`;

    const value = await postModel.findByIdAndUpdate(
        postId,
        { $inc: { [currentReact]: 1, [previousReact]: -1 } },
    )





    // let value;

    // await reactModel.findOne({ userId, postId })

    // if (react === 'like') {
    //     value = await postModel.findOneAndUpdate(
    //         { slug },
    //         { $inc: { 'react.like': 1 } },
    //         { new: true }
    //     )

    // }


    //     }else {
    //     value = await postModel.findOneAndUpdate(
    //         { slug },
    //         { $inc: { 'react.dislike': 1 } },
    //         { new: true }
    //     )
    // }

    return { success: true, data: value }
};

exports.createReactService = async (postId, userId, react) => {
    const created = await reactModel.create({ postId, userId, react })

    return { success: true, data: created }
}