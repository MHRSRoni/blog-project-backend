const slugify = require("slugify");
const postModel = require("./postModel");
const createError = require('http-errors');

exports.createPostService = async (userId, postData) => {
    const checkTitle = await postModel.findOne({ title: postData.title });

    const wordsPerMinute = 130;
    const words = postData.description.split(/\s+/).length;
    const minute = (words / wordsPerMinute).toFixed(1);

    postData.userId = userId;
    postData.readTime = minute;

    let post;

    while (checkTitle) {
        post = await postModel.create({
            ...postData,
            slug: slugify(postData.title + '-' + Math.floor(Math.random() * 1000)),
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
        operation: 'create',
        message: 'New Post has been Created!',
        data: post
    }
};

exports.readSinglePostService = async (slug) => {

    const post = await postModel.findOne({ slug }).select({ _id: 0, updatedAt: 0 })

    return { success: true, operation: 'read', data: post }


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

    return {
        success: true,
        operation: 'read',
        data: post
    }

};

exports.updatePostService = async (slug, userId, postData) => {

    if(postData?.title) {
        let newSlug = slugify(postData.title);
        let exist = false
        do{
            exist = await postModel.findOne({ slug : newSlug });
            if(!exist) break
            newSlug = slugify(postData.title + '-' + Math.floor(Math.random() * 1000));

        }while(exist)
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
