const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");

// createProduct
const createProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// getProduct
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json({ message: "Product fetched successfully", product: findProduct });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct, getProduct };
