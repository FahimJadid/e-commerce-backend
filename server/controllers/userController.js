const generateToken = require("../config/jwtToken");
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
    // res.json({
    //   _id: findUser._id,
    //   firstName: findUser.firstName,
    //   lastName: findUser.lastName,
    //   email: findUser.email,
    //   mobile: findUser.mobile,
    //   token: findUser.generateToken(findUser._id),

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

module.exports = { createUser, loginUser };
