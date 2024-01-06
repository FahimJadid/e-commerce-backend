const Coupon = require("../models/CouponModel");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongoId");

// createCoupon
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json({
      message: "Coupon created successfully",
      coupon: newCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// updateCoupon

const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCoupon) {
      res.status(404);
      throw new Error("Coupon not found");
    }

    res.json({
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// getAllCoupons
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json({
      message: "Coupons fetched successfully",
      coupons,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// deleteCoupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({
      status: "success",
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCoupon, updateCoupon, getAllCoupons, deleteCoupon };
