const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

// User Model
const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First Name required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "First Name required"],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, "Mobile number required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email required"],
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  cart: {
    type: Array,
    default: [],
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  address: [
    {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  refreshToken: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with the stored hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("User", userSchema);
