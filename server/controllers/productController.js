const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const uploadImgToCloudinary = require("../utils/cloudinary");
const validateMongoId = require("../utils/validateMongoId");
const fs = require("fs");

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
    validateMongoId(id);
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
    validateMongoId(id);

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
  validateMongoId(id);

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
  validateMongoId(id);

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

// const rating = asyncHandler(async (req, res) => {
//   const { id } = req.user;
//   const { productId, star } = req.body;

//   try {
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     let isRatingAdded = product.ratings.find(
//       (userId) => userId.postedBy.toString() === id.toString()
//     );

//     if (isRatingAdded) {
//       const updateRating = await Product.updateOne(
//         { ratings: { $elemMatch: isRatingAdded } },
//         { $set: { "ratings.$.star": star } },
//         { new: true }
//       );
//       res.json(updateRating);
//     } else {
//       const rateProduct = await Product.findByIdAndUpdate(
//         productId,
//         {
//           $push: { ratings: { star, postedBy: id } },
//         },
//         { new: true }
//       );
//       res.json(rateProduct);
//     }

//     const getAllRatings = await Product.findById(productId);

//     if (!getAllRatings) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     let totalRating = getAllRatings.ratings.length;

//     if (totalRating === 0) {
//       // No need to calculate the average if there are no ratings
//       return res.json({ totalRating: 0 });
//     }

//     let ratingSum = getAllRatings.ratings
//       .map((item) => item.star)
//       .reduce((prev, curr) => {
//         return prev + curr;
//       }, 0);

//     let actualRating = Math.round(ratingSum / totalRating);

//     let finalProduct = await Product.findByIdAndUpdate(
//       productId,
//       {
//         $set: { totalRating: actualRating },
//       },
//       { new: true }
//     );

//     res.json(finalProduct);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const rating = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoId(id);

  const { productId, star, comment } = req.body;

  if (star < 1 || star > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has already rated the product
    const existingRating = product.ratings.find(
      (rating) => rating.postedBy.toString() === id.toString()
    );

    if (existingRating) {
      // If the user has already rated, update the existing rating
      existingRating.star = star;
      existingRating.comment = comment;
    } else {
      // If the user hasn't rated, add a new rating
      product.ratings.push({ star, comment, postedBy: id });
    }

    // Calculate and update the total rating directly
    const totalRating =
      product.ratings.length === 0
        ? 0
        : Math.round(
            product.ratings.reduce((prev, curr) => prev + curr.star, 0) /
              product.ratings.length
          );

    product.totalRating = totalRating;

    // Save the updated product to the database
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// uploadImages
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => uploadImgToCloudinary(path, "images");
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });
    res.json({ message: "Images uploaded successfully", images });
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
  rating,
  uploadImages,
};
