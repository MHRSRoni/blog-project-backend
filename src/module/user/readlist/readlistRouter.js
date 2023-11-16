const call = require('./readlistControlller');
const { isLoggedIn } = require('../../../auth/auth');


const readlistRouter = require('express').Router()

readlistRouter.get('/', isLoggedIn, call.readReadlistController)
readlistRouter.put('/update/:postId', isLoggedIn, call.updateReadlistController)
readlistRouter.delete('/clear', isLoggedIn, call.clearReadlistController)


module.exports = readlistRouter