const Brand = require("../models/BrandModel");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongoId");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json({
      status: "success",
      message: "Brand created successfully",
      Brand: newBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json({
      status: "success",
      message: "Brand updated successfully",
      Brand: updatedBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json({
      status: "success",
      message: "Brand deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const findBrand = await Brand.findById(id);

    if (!findBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json({
      status: "success",
      message: "Brand fetched successfully",
      Brand: findBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const findAllBrand = await Brand.find();

    if (!findAllBrand) {
      return res.status(404).json({ message: "Brands not found" });
    }

    res.json({
      status: "success",
      message: "Brands fetched successfully",
      Brand: findAllBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrand,
};
