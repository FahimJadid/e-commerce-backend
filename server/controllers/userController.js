const generateToken = require("../config/jwtToken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

// create User / Register User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User already exists");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // find the user by email:
  const findUser = await User.findOne({ email });

  // Check if user exists:
  if (!findUser) {
    throw new Error("User does not exist");
  }

  // Check if password matches:
  const isPasswordMatch = await findUser.comparePassword(password);

  if (isPasswordMatch) {
    // res.json({
    //   _id: findUser?._id,
    //   firstName: findUser?.firstName,
    //   lastName: findUser?.lastName,
    //   email: findUser?.email,
    //   mobile: findUser?.mobile,
    //   token: generateToken(findUser?._id),

    //   message: "User logged in successfully",
    // });

    const { _id, firstName, lastName, email, mobile } = findUser;
    const token = generateToken(findUser._id);

    res.json({
      _id,
      firstName,
      lastName,
      email,
      mobile,
      token,
      message: "User logged in successfully",
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Update a User

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, mobile } = req?.body;

    // Checking if user exists before updating:
    const findUser = await User.findById(id, "-password");
    if (!findUser) {
      throw new Error("User not found");
    }

    // if user exists, update user:
    await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, mobile },
      { new: true }
    );

    // Fetching the updated user:
    const updatedUser = await User.findById(id, "-password");

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    throw new Error("Error updating user:", error);
  }
});

// Get All users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({}, "-password");
    res.json({ users: allUsers });
  } catch (error) {
    throw new Error("Error fetching all users:", error);
  }
});

// Get a Single User
const getUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await User.findById(id, "-password");

    if (!singleUser) {
      throw new Error("User not found");
    }
    res.json({ user: singleUser });
  } catch (error) {
    throw new Error("Error fetching user:", error);
  }
});

// Delete a User

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Checking if user exists:
    const findUser = await User.findById(id, "-password");
    if (!findUser) {
      throw new Error("User not found");
    }

    // if user exists, delete user:
    // await User.deleteOne({ _id: id });
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    throw new Error("Error deleting user:", error);
  }
});

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getAllUsers,
  getUser,
  deleteUser,
};
