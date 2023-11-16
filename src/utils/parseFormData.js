const formidable = require('formidable');


exports.parseFormData = async (req, res, next) => {
    try {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {

            req.body = fields

            req.files = files

            next()
        })

    } catch (error) {
        next(error)
    }
}