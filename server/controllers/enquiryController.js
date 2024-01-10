const Enquiry = require("../models/enquiryModel");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongoId");

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.json({
      status: "success",
      Enquiry: newEnquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({
      status: "success",
      Enquiry: updatedEnquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    res.json({
      status: "success",
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const findEnquiry = await Enquiry.findById(id);

    if (!findEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({
      status: "success",
      Enquiry: findEnquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllEnquiry = asyncHandler(async (req, res) => {
  try {
    const findAllEnquiry = await Enquiry.find();
    if (!findAllEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({
      status: "success",
      Enquiry: findAllEnquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getAllEnquiry,
};
