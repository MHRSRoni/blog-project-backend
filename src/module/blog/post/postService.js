const postModel = require("./postModel");
const createError = require('http-errors');
const { createSlug } = require("../../../utils/createSlug");

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
        .populate({ path: 'userId', select: { name: 1, picture: 1, _id: 0 } })
        // .populate({ path: 'categoryId', select: { name: 1, _id: 0 } })
        .select({ _id: 0, updatedAt: 0 })

    return { success: true, operation: 'read', data: post }


};

exports.readAllPostService = async (page, limit, sort) => {

    let post = {};

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const postCount = await postModel.find().count();

    let allPosts = await postModel.find()
        .populate({ path: 'userId', select: { name: 1, picture: 1, _id: 0 } })
        // .populate({ path: 'categoryId', select: { name: 1, _id: 0 } })
        .skip(startIndex)
        .limit(limit)

    if (sort === 'latest') {
        allPosts = await postModel.find().sort({ createdAt: 'desc' })
            .populate({ path: 'userId', select: { name: 1, picture: 1, _id: 0 } })
            // .populate({ path: 'categoryId', select: { name: 1, _id: 0 } })
            .skip(startIndex)
            .limit(limit)
    }

    if (sort === 'top') {
        allPosts = await postModel.find().sort({ 'react.like': 'desc' })
            .populate({ path: 'userId', select: { name: 1, picture: 1, _id: 0 } })
            // .populate({ path: 'categoryId', select: { name: 1, _id: 0 } })
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

    return {
        success: true,
        operation: 'read',
        data: post
    }

};

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

exports.searchPostService = async (page, limit, search) => {

    const searchPost = await postModel.find({
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ]
    })
        .skip((page - 1) * limit)
        .limit(limit)

    return {
        success: true,
        operation: 'read',
        data: searchPost
    }
};

exports.imageUploadService = async (req) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        const config = {
            cloud_name: "dscxtnb94",
            api_key: "487396911159431",
            api_secret: "JX_Az4I67YiWh7gVODcnw5yxFtY",
            secure: true
        }

        console.log(fields)
        const response = await cloudinary.uploader.upload(files.image.filepath, config)

        return response;

    })
};
