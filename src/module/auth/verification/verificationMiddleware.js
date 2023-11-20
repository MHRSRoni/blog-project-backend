const { decodeToken, decrypt } = require("./verificationUtils")

exports.isVerifiedFor = requireSubject => async (req, res, next) => {
    try {
        const token = req.query?.['access-token']
        if(!token) return res.status(400).json({success : false, message : 'unauthorized'})
        const verifiedData = await decodeToken(token)
        const data = await decrypt(verifiedData)
        if(data?.subject == requireSubject) return next()
        return res.status(400).json({success : false, message : 'unauthorized'})
    } catch (error) {
        next(error)
    }
}