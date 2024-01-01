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
});

// userSchema.pre("save", function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = bcrypt.hashSync(this.password, 10);
//   next();
// });

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

module.exports = mongoose.model("User", userSchema);
