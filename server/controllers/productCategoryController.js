const Category = require("../models/ProductCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongoId");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json({
      status: "success",
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      status: "success",
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const findCategory = await Category.findById(id);

    if (!findCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      status: "success",
      message: "Category fetched successfully",
      category: findCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const findAllCategory = await Category.find();

    if (!findAllCategory) {
      return res.status(404).json({ message: "Categories not found" });
    }

    res.json({
      status: "success",
      message: "Categories fetched successfully",
      category: findAllCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory,
};
