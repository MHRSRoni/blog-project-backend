const call = require('./readlistControlller');
const { isLoggedIn } = require('../../../auth/auth');


const readlistRouter = require('express').Router()


/**
 * Readlist routes.
 * @namespace readlistRoutes
 */

/**
 * Get the user's readlist.
 * @function
 * @memberof readlistRoutes
 * @name getReadlist
 * @returns {void}
 */
readlistRouter.get('/', isLoggedIn, call.readReadlistController)
/**
 * Update a post in the user's readlist.
 * @function
 * @memberof readlistRoutes
 * @name updateReadlist
 * @returns {void}
 */
readlistRouter.put('/update/:postId', isLoggedIn, call.updateReadlistController)
/**
 * Clear the user's readlist.
 * @function
 * @memberof readlistRoutes
 * @name clearReadlist
 * @returns {void}
 */
readlistRouter.delete('/clear', isLoggedIn, call.clearReadlistController)


module.exports = readlistRouter