const postModel = require("./postModel");
const createError = require('http-errors');
const { createSlug } = require("../../../utils/createSlug");
const userProfileModel = require("../../user/profile/userProfileModel");
const categoryModel = require("../category/categoryModel");
const reactModel = require("./reactModel");

exports.createPostService = async (userId, postData) => {
    const checkTitle = await postModel.findOne({ title: postData.title })

    const wordsPerMinute = 130;
    const words = postData.description.split(/\s+/).length;
    const minute = (words / wordsPerMinute).toFixed(1);

    postData.userId = userId;
    postData.readTime = minute;

    let post;

    while (checkTitle) {
        post = await postModel.create({
            ...postData,
            slug: createSlug(postData.title) + '-' + Math.floor(Math.random() * 1000),
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
        ...postData, slug: createSlug(postData.title), userId: userId
    });

    return {
        success: true,
        operation: 'create',
        message: 'New Post has been Created!',
        data: post
    }
};

exports.readSinglePostService = async (slug) => {

    const post = await postModel.findOne({ slug })
        .populate('userId', 'name picture -_id')
        // .populate('categoryId', 'name cover - _id')

    return { success: true, operation: 'read', data: post }

};

exports.readAllPostService = async (userId, page, limit, sort) => {

    let post = {};
    let allPosts;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const postCount = await postModel.countDocuments();

    if (sort == 'latest') {
        allPosts = await postModel.find().sort({ createdAt: 'desc' })
            .populate('userId', 'name picture -_id')
            // .populate('categoryId', 'name cover - _id')
            .skip(startIndex)
            .limit(limit)


    } else if (sort == 'top') {
        allPosts = await postModel.find().sort({ 'react.like': 'desc' })
            .populate('userId', 'name picture -_id')
            // .populate('categoryId', 'name cover - _id')
            .skip(startIndex)
            .limit(limit)
    } else {
        allPosts = await postModel.find()
            .populate('userId', 'name picture -_id')
            // .populate('categoryId', 'name cover - _id')
            .skip(startIndex)
            .limit(limit)
    }

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

    return {
        success: true,
        operation: 'read',
        data: post
    }

};

exports.readPostByCategoryService = async (page, limit, categoryId) => {
    let post = {};

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const postCount = await postModel.countDocuments({ categoryId: categoryId });
    const category = await categoryModel.findById(categoryId);

    let allPosts = await postModel.find({ categoryId: categoryId })
        .populate('userId', 'name picture -_id')
        // .populate('categoryId', 'name cover - _id')
        .skip(startIndex)
        .limit(limit)

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

    return {
        success: true,
        operation: 'read',
        categoryName: category.title,
        data: post
    }

};

exports.readRelevantPostService = async (page, limit, email) => {
    let post = {};

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (email !== null) {
        const user = await userProfileModel.findOne({ email });

        if (user?.interest.length === 0) {
            throw createError(404, 'Interest not found!');
        }

        const postCount = await postModel.find({ categoryId: user.interest }).count();

        let allPosts = await postModel.find({ categoryId: user.interest })
            .populate('userId', 'name picture -_id')
            //.populate('categoryId', 'name cover - _id')
            .skip(startIndex)
            .limit(limit)

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

        return {
            success: true,
            operation: 'read',
            data: post
        }
    } else {

        const postCount = await postModel.find().count();

        const allPosts = await postModel.find()
            .populate('userId', 'name picture -_id')
            //.populate('categoryId', 'name cover - _id')
            .skip((page - 1) * limit)
            .limit(limit)

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

        return {
            success: true,
            operation: 'read',
            data: post
        }
    }
};

exports.allPostByUser = async (userId, limit, page) => {
    let post = {};

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const posts = await postModel.find({ userId }).skip(startIndex).limit(limit);



    // post.totalPost = posts.length;
    post.pageCount = Math.ceil(posts.length / limit);

    if (endIndex < posts.length) {
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

    post.resultPosts = posts;

    return {
        success: true,
        postCount: posts.length,
        data: post,
    }
}

exports.updatePostService = async (slug, userId, postData) => {

    if (postData?.title) {
        let newSlug = createSlug(postData.title);
        let exist = false
        do {
            exist = await postModel.findOne({ slug: newSlug });
            if (!exist) break
            newSlug = createSlug(postData.title) + '-' + Math.floor(Math.random() * 1000);

        } while (exist)
        postData.slug = newSlug
    }


    if (postData?.description) {
        const wordsPerMinute = 130;
        const words = postData?.description?.split(/\s+/).length;
        const minute = Math.ceil(words / wordsPerMinute);
        postData.readTime = minute;

    }

    const updatePost = await postModel.findOneAndUpdate(
        { slug, userId }, { ...postData }
    );

    if (!updatePost) {
        throw createError(404, 'Post not found!');
    }

    return {
        success: true,
        operation: 'update',
        message: 'Post has been Updated!'
    }
};

exports.deletePostService = async (slug, userId) => {

    const deletePost = await postModel.findOneAndDelete({ slug, userId });

    if (!deletePost) {
        throw createError(404, 'Post not found!');
    }

    return {
        success: true,
        operation: 'delete',
        message: 'Post has been Deleted!'
    }
};

exports.searchPostService = async (page, limit, search, query, postId) => {

    let finalQuery = {};
    let post = {};
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (search) {
        finalQuery = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }
    }
    if (query) {
        finalQuery = { ...finalQuery, ...query }
    }

    const totalPost = await postModel.countDocuments(finalQuery);
    const react = await reactModel.find({ postId }, { userId: 1 });

    const searchPost = await postModel.find(finalQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name picture _id')
        .populate('categoryId', 'title _id')


    post.totalPost = totalPost;
    post.pageCount = Math.ceil(totalPost / limit);

    if (endIndex < totalPost) {
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
    post.resultPosts = searchPost;

    return {
        success: true,
        operation: 'read',
        data: post
    }
};

