const generateToken = require("../config/jwtToken");
const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");

const uniqid = require("uniqid");

const Coupon = require("../models/CouponModel");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongoId");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("../controllers/emailController");
const crypto = require("crypto");

// create User / Register User
const createUser = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    const findUser = await User.findOne({ email });

    if (!findUser) {
      const newUser = await User.create(req.body);
      res.json({ message: "Registered successfully", user: newUser });
    } else {
      throw new Error("User already exists");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  try {
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
      const refreshToken = generateRefreshToken(findUser?._id);
      const { _id, firstName, lastName, email, mobile } = findUser;
      const token = generateToken(findUser._id);

      const updateUser = await User.findByIdAndUpdate(
        findUser._id,
        { refreshToken: refreshToken },
        { new: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });

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
  } catch (error) {
    throw new Error(error);
  }
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const findAdmin = await User.findOne({ email });

    if (findAdmin.role !== "admin") {
      throw new Error("Unauthorized!");
    }

    const isPasswordMatch = await findAdmin.comparePassword(password);

    if (isPasswordMatch) {
      const refreshToken = generateRefreshToken(findAdmin?._id);
      const { _id, firstName, lastName, email, mobile } = findAdmin;
      const token = generateToken(findAdmin._id);

      const updateAdmin = await User.findByIdAndUpdate(
        findAdmin._id,
        { refreshToken: refreshToken },
        { new: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });

      res.json({
        _id,
        firstName,
        lastName,
        email,
        mobile,
        token,
        message: "Admin logged in successfully",
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Handling refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
  try {
    const cookie = req?.cookies;
    const refreshToken = cookie?.refreshToken;
    // console.log(refreshToken);
    if (!refreshToken) {
      throw new Error("No refresh token found in Cookies");
    }

    const user = await User.findOne({ refreshToken }).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      // console.log(decoded);
      // console.log(decoded.user.id);
      if (err || user.id !== decoded.user.id) {
        throw new Error("Invalid refresh token");
      }

      // Generate a new access token
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    const refreshToken = cookie?.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token found in Cookies");
    }

    const user = await User.findOne({ refreshToken }).select("-password");

    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.status(204).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, { $unset: { refreshToken: "" } });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    throw new Error(error);
  }
});

// Update a User

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user; // best practice to get id from token
    validateMongoId(id);
    const { firstName, lastName, email, mobile } = req?.body;

    // update user:
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, mobile },
      { new: true }
    ).select("-password"); // Exclude the 'password' field from the response

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    throw new Error(error);
  }
});

// save user Address
const saveAddress = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    validateMongoId(id);

    // update user:
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { address: req?.body?.address },
      { new: true }
    ).select("-password");

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    throw new Error(error);
  }
});

// Get All users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({}, "-password");
    res.json({ users: allUsers });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a Single User
const getUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);

    const singleUser = await User.findById(id, "-password");

    if (!singleUser) {
      throw new Error("User not found");
    }
    res.json({ user: singleUser });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a User

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);

    // Checking if user exists:
    const findUser = await User.findById(id);
    if (!findUser) {
      throw new Error("User not found");
    }

    // if user exists, delete user:
    // await User.deleteOne({ _id: id });
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

// Block a User
const blockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);

    // update the user to set blocked to true
    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );

    if (!block) {
      throw new Error("User not found");
    }

    res.json({
      message: "User blocked successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// unlock a User

const unblockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);

    // update the user to set blocked to true
    const unblock = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );

    if (!unblock) {
      throw new Error("User not found");
    }

    res.json({
      message: "User Unblocked successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update password
const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;
    validateMongoId(id);

    const user = await User.findById(id).select("+password");

    const isPasswordMatch = await user.comparePassword(
      oldPassword,
      user.password
    );

    if (!isPasswordMatch) {
      throw new Error("Old password does not match");
    } else {
      // const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = newPassword;
      const updatedPassword = await user.save();

      res.json({
        message: "Password updated successfully",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found with the provided email");
  }

  try {
    const resetToken = await user.createPasswordResetToken();
    await user.save();

    //  const resetURL = `${req.protocol}://${req.get(
    //    "host"
    //  )}/reset-password/${resetToken}`;

    const resetURL = `<a href="http://localhost:5000/api/v1/user/resetPassword/${resetToken}">Click Here to Reset Password</a>`;

    const data = {
      to: email,
      subject: "Forgot Password Reset Link",
      text: `Hey! You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the link or paste it into your browser to complete the process because this link will expire in ten minutes.\n\n`,
      htm: resetURL,
    };

    sendEmail(data);
    res.json({
      message: "Password reset email sent successfully",
      resetToken,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error(
        "Invalid or expired reset token, Please try again later."
      );
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

// getWisHlist
const getWishlist = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    validateMongoId(id);

    const findUser = await User.findById(id, "-password").populate("wishlist");

    if (!findUser) {
      throw new Error("User not found");
    }
    res.json({ user: findUser });
  } catch (error) {
    throw new Error(error);
  }
});

// userCart
const userCart = asyncHandler(async (req, res) => {
  try {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoId(_id);

    let products = [];
    const user = await User.findById(_id);

    const existingCart = await Cart.findOne({ orderedBy: user._id });

    if (existingCart) {
      existingCart.deleteOne();
    }

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.quantity = cart[i].quantity;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    // console.log("products", products);

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].quantity;
    }

    // console.log("cartTotal", cartTotal);

    let newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user._id,
    }).save();

    // console.log("newCart", newCart);

    res.json(newCart);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

// get user cart

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);

  try {
    const cart = await Cart.findOne({ orderedBy: _id }).populate(
      "products.product"
    );

    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

// empty cart
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);

  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndDelete({ orderedBy: user._id });

    if (cart) {
      res.json({ message: "User cart emptied successfully.", cart });
    } else {
      res.json({ message: "User cart is already empty." });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// apply coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoId(_id);

  try {
    const validCoupon = await Coupon.findOne({ name: coupon });

    if (!validCoupon || validCoupon === null) {
      throw new Error("Invalid coupon");
    }

    const user = await User.findOne({ _id });

    let { cartTotal } = await Cart.findOne({
      orderedBy: user._id,
    }).populate("products.product");

    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      { totalAfterDiscount },
      { new: true }
    );

    res.json({
      totalAfterDiscount,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// create order
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoId(_id);

  try {
    if (!COD) {
      throw new Error("Please select a payment method");
    }

    const user = await User.findById(_id);

    let userCart = await Cart.findOne({ orderedBy: user._id });

    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        amount: finalAmount,
        currency: "usd",
        status: "Cash on Delivery",
        created: Date.now(),
        // payment_method_types: ["cash"],
        method: "COD",
      },
      orderedBy: user._id,
      orderStatus: "Cash on Delivery",
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: {
            $inc: { quantity: -item.quantity, sold: +item.quantity },
          },
        },
      };
    });

    const updated = await Product.bulkWrite(update, {});

    res.json({ message: "Order created successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

// get user orders

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);

  try {
    const orders = await Order.findOne({ orderedBy: _id })
      .select("-password")
      .populate("products.product")
      .populate("orderedBy")
      .exec();

    res.json(orders);
  } catch (error) {
    throw new Error(error);
  }
});

// update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updatedOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );

    res.json({
      message: "Order status updated successfully",
      updatedOrderStatus,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  loginAdmin,
  updateUser,
  saveAddress,
  getAllUsers,
  getUser,
  deleteUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  getWishlist,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
};
