const Color = require("../models/ColorModel");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongoId");

const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.json({
      status: "success",
      Color: newColor,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedColor) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.json({
      status: "success",
      Color: updatedColor,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deletedColor = await Color.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({ message: "Color not found" });
    }
    res.json({
      status: "success",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const findColor = await Color.findById(id);

    if (!findColor) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.json({
      status: "success",
      Brand: findColor,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getallColor = asyncHandler(async (req, res) => {
  try {
    const findAllColor = await Color.find();
    if (!findAllColor) {
      return res.status(404).json({ message: "Colors not found" });
    }

    res.json({
      status: "success",
      Brand: findAllColor,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
};
