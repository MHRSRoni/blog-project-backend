
exports.createSlug = (input) => {
    // let slug = input.toLowerCase();

    let slug = slug.replace(/\s+/g, '-')
    // .replace(/[^\w-]+/g, '')

    return slug
}