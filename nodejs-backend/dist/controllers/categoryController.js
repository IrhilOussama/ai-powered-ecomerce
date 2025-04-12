import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.getCategoriesWithProductCount();
        res.json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.getOne(id);
        if (category === undefined) {
            res.status(404).json({ error: 'No such category with this id' });
        }
        else {
            res.json(category);
        }
    }
    catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};
export const createCategory = async (req, res) => {
    try {
        let { title, description } = req.body;
        if (!title) {
            res.status(400).json({ error: 'Title is required' });
            return;
        }
        const newCategory = await Category.create({ title, description, image: req.cloudinaryImage ? req.cloudinaryImage.secure_url : '' });
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    }
    catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Failed to create category" });
    }
};
export const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        let { title, description } = req.body;
        if (!title) {
            res.status(400).json({ error: 'Title is required' });
            return;
        }
        let result;
        if (req.cloudinaryImage) {
            // delete old categorie image from cloudinary if it is not null
            const oldImageUrl = (await Category.getOne(id)).image;
            if (oldImageUrl && oldImageUrl !== 'null' && oldImageUrl !== '') {
                await cloudinary.uploader.destroy(oldImageUrl);
            }
            result = await Category.update({ id, title, description, image: req.cloudinaryImage.secure_url });
        }
        else {
            result = await Category.update({ id, title, description, image: '' });
        }
        res.status(201).json({ message: 'Category updated successfully', category: result });
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        await Category.delete(id);
        res.json({ msg: `Category with id ${id} has been deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
