const slugify = require("slugify");
const postModel = require("./postModel");
const createError = require('http-errors');

exports.createPostService = async (userId, postData) => {
    const checkTitle = await postModel.findOne({ title: postData.title });

    let post;

    while (checkTitle) {
        post = await postModel.create({
            ...postData,
            slug: slugify(postData.title + '-' + Math.floor(Math.random() * 1000)),
            userId: userId
        });

        if (post) {
            return {
                success: true,
                message: 'New Post has been Created!',
                data: post
            };
        }
    }


    post = await postModel.create({
        ...postData, slug: slugify(postData.title), userId: userId
    });

    return {
        success: true,
        message: 'New Post has been Created!',
        data: post
    }
};

exports.readSinglePostService = async (slug) => {

    const post = await postModel.findOne({ slug }).select({ _id: 0, updatedAt: 0 })

    return { status: "success", operation: 'read', data: post }


};

exports.readAllPostService = async (page, limit, sort) => {

    let post = {};

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const postCount = await postModel.find().count();

    let allPosts = await postModel.find()
        .skip(startIndex)
        .limit(limit)

    if (sort === 'latest') {
        allPosts = await postModel.find().sort({ createdAt: 'desc' })
            .skip(startIndex)
            .limit(limit)
    }

    if (sort === 'top') {
        allPosts = await postModel.find().sort({ 'react.like': 'desc' })
            .skip(startIndex)
            .limit(limit)
    }

    // if (sort === 'relevant') {
    //     allPosts = await postModel.find().sort({ category: 'desc' })
    //         .skip(startIndex)
    //         .limit(limit)
    // }

    post.totalPost = postCount;
    post.pageCount = Math.ceil(postCount / limit);

    if (endIndex < postCount) {
        post.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        post.prev = {
            page: page - 1,
            limit: limit
        }
    }
    post.resultPosts = allPosts;

    return { status: 'success', operation: 'read', data: post }

};

// exports.readLatestPostService = async (page, limit) => {
//     let post = {};

//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;

//     const postCount = await postModel.find().count();

//     const allPosts = await postModel.find().sort({ createdAt: 'desc' })
//         .skip(startIndex)
//         .limit(limit)

//     post.totalPost = postCount;
//     post.pageCount = Math.ceil(postCount / limit);

//     if (endIndex < postCount) {
//         post.next = {
//             page: page + 1,
//             limit: limit
//         }
//     }
//     if (startIndex > 0) {
//         post.prev = {
//             page: page - 1,
//             limit: limit
//         }
//     }
//     post.resultPosts = allPosts;

//     return { status: 'success', operation: 'read', data: post }
// }

exports.readTopPostService = async () => {

}

exports.updatePostService = async (slug, postData) => {
    const updatePost = await postModel.findOneAndUpdate(
        { slug }, { ...postData, slug: slugify(postData.title) }
    );

    if (!updatePost) {
        throw createError(404, 'Post not found!');
    }

    return {
        success: true,
        message: 'Post has been Ubdated!',
        data: updatePost
    }
};

exports.deletePostService = async (slug) => {

    const deletePost = await postModel.findOneAndDelete({ slug });

    if (!deletePost) {
        throw createError(404, 'Post not found!');
    }

    return {
        success: true,
        message: 'Post has been Deleted!'
    }
};