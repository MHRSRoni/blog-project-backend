const formidable = require('formidable');


exports.parsePostFormData = async (req, res, next) => {
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

exports.parseUserFormData = async (req, res, next) => {
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