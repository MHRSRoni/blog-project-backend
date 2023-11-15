const { readCategory, createCategory, updateCategory, deleteCategory } = require("./categoryService");
const { categoryValidationSchema, ObjectIdSchema } = require("./categoryValidation");

exports.createCategoryController = async (req, res, next) => {
    try {
        
        const validCategoryData = await categoryValidationSchema.validateAsync(req.body);
        const result = await createCategory(validCategoryData);
        res.status(200).json(result);

    } catch (error) {
        next(error)
    }
}



exports.readCategoryController = async (req, res, next) => {
    try {
        
        const result = await readCategory();
        res.status(200).json(result);

    } catch (error) {
        next(error)
    }
}



exports.updateCategoryController = async (req, res, next) => {
    try {
        
        const categoryId = req.params?.categoryId;
        const categoryData = req.body;

        const validCategoryId = await ObjectIdSchema.validateAsync(categoryId)
        const validCategoryData = await categoryValidationSchema.validateAsync(categoryData)

        const result = await updateCategory(validCategoryId, validCategoryData);

        res.status(200).json(result);

    } catch (error) {
        next(error)
    }
}




exports.deleteCategoryController = async (req, res, next) => {
    try {
        
        const categoryId = req.params?.categoryId;

        const validCategoryId = await ObjectIdSchema.validateAsync(categoryId)
        const result = await deleteCategory(validCategoryId);

        res.status(200).json(result);

    } catch (error) {
        next(error)
    }
}