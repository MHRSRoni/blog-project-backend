
exports.createSlug = (input) => {
    // let slug = input.toLowerCase();

    let slug = input.replace(/\s+/g, '-').replace(/--+/g, '-')
    // .replace(/^-+/, '-')
    // .replace(/-+$/, '-')
    // .replace(/[^\w-]+/g, '-')
    // .replace(/--+/g, '-')
    // .replace(/^-+/, '')
    // .replace(/-+$/, '');

    return slug
}