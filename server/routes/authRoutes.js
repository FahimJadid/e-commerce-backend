const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgotPasswordToken", forgotPasswordToken);

router.put("/resetPassword/:resetToken", resetPassword);
router.put("/password", authMiddleware, updatePassword);

router.post("/login", loginUser);
router.post("/admin", loginAdmin);

router.post("/cart", authMiddleware, userCart);
router.post("/cart/coupon", authMiddleware, applyCoupon);
router.post("/cart/cashOrder", authMiddleware, createOrder);

router.get("/allUsers", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/empty", authMiddleware, emptyCart);

router.delete("/:id", deleteUser);

router.put("/update", authMiddleware, updateUser);
router.put("/address", authMiddleware, saveAddress);

router.put("/blockUser/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblockUser/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
