const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// createProduct
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
    }
    const newProduct = await Product.create(req.body);
    res.json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// updateProduct

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.title) {
      req.body.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Product

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findOneAndDelete({ _id: id });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product Deleted successfully",
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

// getAllProducts
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Filtered
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObject[el]);

    console.log(queryObject);
    let queryStr = JSON.stringify(queryObject); // convert object to string
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`); // add $ sign before gt, gte, lt, lte

    let query = Product.find(JSON.parse(queryStr));

    // Sorted
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const totalProducts = await Product.countDocuments();
      if (skip >= totalProducts) {
        throw new Error("This page does not exist");
      }
    }

    const findAllProducts = await query;

    res.json({
      message: "Products fetched successfully",
      products: findAllProducts,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  // Extract user ID from the authenticated user
  const { id } = req.user;

  // Extract product ID from the request body
  const { productId } = req.body;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the user in the database by their ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product is already in the user's wishlist
    const isProductInWishlist = user.wishlist.find(
      (id) => id.toString() === productId
    );

    if (isProductInWishlist) {
      // If the product is already in the wishlist, remove it
      let user = await User.findByIdAndUpdate(
        id,
        { $pull: { wishlist: productId } },
        { new: true }
      );
      res.json({ message: "Product removed from wishlist", user });
    } else {
      // If the product is not in the wishlist, add it
      let user = await User.findByIdAndUpdate(
        id,
        { $push: { wishlist: productId } },
        { new: true }
      );
      res.json({ message: "Product added to  wishlist", user });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  addToWishlist,
};
