
exports.createSlug = (input) => {
    let slug = input.toLowerCase();

    slug = slug.replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

    return slug
}