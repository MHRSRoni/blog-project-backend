const cloudinary = require('cloudinary').v2;

exports.imageUpload = type => async (req, res, next) => {
    try {
        console.log('hi')
        const folder = `health_plus/${type}`;
        const config = {
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true,
            folder: folder
        }

        const response = await cloudinary.uploader.upload(req.files.image.filepath, config)

        req.body.picture = response.url

        next()
    } catch (error) {
        next(error)
    }
};
