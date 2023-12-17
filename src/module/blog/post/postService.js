const postModel = require("./postModel");
const createError = require('http-errors');
const { createSlug } = require("../../../utils/createSlug");
const userProfileModel = require("../../user/profile/userProfileModel");
const categoryModel = require("../category/categoryModel");
const reactModel = require("./reactModel");


/**
 * Creates a new post for a given user.
 *
 * @param {string} userId - The ID of the user creating the post.
 * @param {object} postData - The data of the post being created.
 * @param {string} postData.title - The title of the post.
 * @param {string} postData.description - The description of the post.
 * @param {string} postData.categoryId - The ID of the category the post belongs to.
 * @return {object} - The result of the post creation.
 * @return {boolean} result.success - Indicates if the post creation was successful.
 * @return {string} result.operation - The operation performed (e.g., 'create').
 * @return {string} result.message - A message describing the result of the operation.
 * @return {object} result.data - The created post data.
 */

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

    if (post) {
        await categoryModel.findByIdAndUpdate(postData?.categoryId, { $inc: { postCount: 1 } })
        return {
            success: true,
            operation: 'create',
            message: 'New Post has been Created!',
            data: post
        }
    }

};

/**
 * Retrieves a single post from the database based on its slug.
 *
 * @param {string} slug - The slug of the post.
 * @return {object} - An object containing the post information.
 */

exports.readSinglePostService = async (slug) => {

    const post = await postModel.findOne({ slug })
        .populate('userId', 'name picture -_id')
    // .populate('categoryId', 'name cover - _id')

    return { success: true, operation: 'read', data: post }

};

/**
 * Retrieves all posts for a given user.
 *
 * @param {string} userId - The ID of the user.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of posts to retrieve per page.
 * @param {string} sort - The sorting option for the posts ('latest' or 'top').
 * @return {object} An object containing the success status, operation type, and retrieved post data.
 */

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

/**
 * Retrieves a list of posts by category.
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The maximum number of posts per page.
 * @param {string} categoryId - The ID of the category.
 * @return {Object} The response object containing the list of posts, pagination information, and category name.
 */

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

/**
 * Retrieves relevant posts based on the specified page, limit, and email.
 *
 * @param {number} page - The page number.
 * @param {number} limit - The maximum number of posts per page.
 * @param {string} email - The email of the user.
 * @return {Promise<object>} An object containing the retrieved posts.
 */

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

/**
 * Retrieves all posts by a specific user.
 *
 * @param {string} userId - The ID of the user.
 * @param {number} limit - The maximum number of posts to retrieve per page.
 * @param {number} page - The page number to retrieve.
 * @return {object} An object containing the success status, the number of posts retrieved, and the retrieved posts.
 */


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

/**
 * Updates a post in the database.
 *
 * @param {string} slug - The slug of the post.
 * @param {string} userId - The ID of the user who owns the post.
 * @param {object} postData - The data to update the post with.
 * @return {object} An object with success, operation, and message properties.
 */

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

/**
 * Deletes a post by slug and userId.
 *
 * @param {string} slug - The slug of the post to be deleted.
 * @param {string} userId - The ID of the user who owns the post.
 * @return {object} - An object indicating the success of the operation and a message.
 */


exports.deletePostService = async (slug, userId) => {

    const deletePost = await postModel.findOneAndDelete({ slug, userId });

    if (!deletePost) {
        throw createError(404, 'Post not found!');
    }

    await categoryModel.findByIdAndUpdate(postData?.categoryId, { $inc: { postCount: -1 } })

    return {
        success: true,
        operation: 'delete',
        message: 'Post has been Deleted!'
    }
};

/**
 * Retrieves a list of posts based on search criteria.
 *
 * @param {number} page - The page number of the results.
 * @param {number} limit - The maximum number of posts to retrieve per page.
 * @param {string} search - The search term to filter posts by title or description.
 * @param {object} query - Additional query parameters for filtering posts.
 * @param {string} query.categoryId - The ID of the category to filter posts by.
 * @param {string} postId - The ID of the post to retrieve reactions for.
 * @return {object} The response object containing the list of posts and pagination information.
 */

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
        if (query.categoryId) {
            const category = await categoryModel.findById(query.categoryId)
            post.categoryName = category?.title
        }
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

