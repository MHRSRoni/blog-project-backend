const categoryModel = require("./categoryModel");

exports.readCategory = async () => {
    const category = await categoryModel.find({});

    if (!category) {
        throw createError(404, "category not found");
    }

    return { success: true, data: category }
}



exports.createCategory = async (categoryData) => {
    const created = await categoryModel.create(categoryData);

    if (!created) {
        throw createError(501, "category not created");
    }

    return { success: true, data: created }
}



exports.updateCategory = async (categoyId, categoryData) => {
    const updated = await categoryModel.findByIdAndUpdate(categoyId, categoryData);

    if (!updated) {
        throw createError(501, "category not updated");
    }

    return { success: true, data: updated }
}



exports.deleteCategory = async (categoyId) => {
    const deleted = await categoryModel.findByIdAndDelete(categoyId);

    if (!deleted) {
        throw createError(501, "category not deleted");
    }

    return { success: true, data: deleted }
}