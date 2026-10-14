import Category from '../schemas/categories.js';
import Product from '../schemas/products.js';

async function getAllCategories(req, res) {
    try {
        const categories = await Category.find();

        if (categories.length === 0)
            return res.status(200).json({message: 'No categories found.', categories: []});

        return res.status(200).json({categories: categories});
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function getCategoryById(req, res) {
    try {
        const {id} = req.params;

        const category = await Category.findById(id);

        if (!category)
            return res.status(404).json({message: 'Category not found.'});

        return res.status(200).json({category: category});
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function addCategory(req, res) {
    try {
        const values = req.body;

        const newCategory = await Category.create(values);

        return res.status(201).json({message: 'category added successfully', category: newCategory});
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function updateCategory(req, res) {
    try {
        const {id} = req.params;
        const values = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, values, {new: true, runValidators: true});

        if (!updatedCategory)
            return res.status(404).json({message: 'Category not found.'});

        return res.status(200).json({message: 'category updated successfully', category: updatedCategory});
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function deleteCategory(req, res) {
    try {
        const {id} = req.params;

        // block the delete if products still point to this category
        const hasProducts = await Product.exists({category_id: id});

        if (hasProducts)
            return res.status(409).json({message: 'Cannot delete category: category has products.'});

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory)
            return res.status(404).json({message: 'Category not found.'});

        return res.status(200).json({message: 'category deleted successfully', category: deletedCategory});
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

export {getAllCategories, getCategoryById, addCategory, updateCategory, deleteCategory};
