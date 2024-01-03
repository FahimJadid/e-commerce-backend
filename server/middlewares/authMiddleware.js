const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req?.headers?.authorization &&
    req?.headers?.authorization?.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded?.user?.id).select("-password");
        req.user = user;

        next();
      }
    } catch (error) {
      throw new Error(`Unauthorized, token failed: ${error.message}`);
    }
  } else {
    throw new Error("Not authorized, no token");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const { email } = req.user;

  const adminUser = await User.findOne({ email });

  if (adminUser.role === "admin") {
    next();
  } else {
    throw new Error("Not authorized as an admin");
  }
});

module.exports = { authMiddleware, isAdmin };
