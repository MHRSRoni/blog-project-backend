const call = require('./categoryController')
const categoryRouter = require('express').Router()


categoryRouter.get('/read', call.readCategoryController)
categoryRouter.post('/create', call.createCategoryController)
categoryRouter.put('/update/:categoryId', call.updateCategoryController)
categoryRouter.delete('/delete/:categoryId', call.deleteCategoryController)


module.exports = categoryRouter