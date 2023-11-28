const cloudinary = require('cloudinary').v2;

exports.imageUpload = type => async (req, res, next) => {
    try {
        const folder = `health_plus/${type}`;
        const config = {
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true,
            folder: folder
        }

        if (req.body?.picture) {
            const response = await cloudinary.uploader.upload(req.body.picture.filepath, config)

            req.body.picture = response.url
        }
        next()
    } catch (error) {
        next(error)
    }
};
