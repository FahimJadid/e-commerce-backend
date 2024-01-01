const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("User", userSchema);
