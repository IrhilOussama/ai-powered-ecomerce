

import { Request, Response } from 'express';
import Category from '../models/Category.js';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.getOne(id);
    if (category === undefined) {
      res.status(404).json({ error: 'No such category with this id' });
    } else {
      res.json(category);
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description } = req.body;
      if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return
      }
  
      const newCategory = await Category.create({ title, description });
      res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  };

  export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const { title, description } = req.body;
      if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return 
      }
  
      const updatedCategory = await Category.update({ id, title, description });
      res.status(201).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  };
  
  export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      await Category.delete(id);
      res.json({ msg: `Category with id ${id} has been deleted successfully` });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};


