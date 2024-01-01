const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

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
    res.json({ message: "Login successful", user: findUser });
  } else {
    throw new Error("Invalid Credentials");
  }
});

module.exports = { createUser, loginUser };
