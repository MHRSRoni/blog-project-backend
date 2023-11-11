const slugify = require("slugify");
const postModel = require("./postModel");
const createError = require('http-errors');

exports.createPostService = async (userId, postData) => {
    const checkTitle = await postModel.findOne({ title: postData.title });

    if (checkTitle) {
        throw createError(409, 'Title already exists!');
    }

    const post = await postModel.create({
        ...postData, slug: slugify(postData.title), userId: userId
    });

    return {
        success: true,
        message: 'New Post has been Created!',
        data: post
    }
};

exports.readPostService = async (slug) => {
    const post = await postModel.findOne({ slug });

    if (!post) {
        throw createError(404, 'Post not found!');
    }

    return {
        success: true,
        data: post
    }
};

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