const mongoose = require("mongoose");

const { Schema } = mongoose;

// productSchema Model
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: String,
      enum: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS", "Other"],
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      enum: [
        "white",
        "black",
        "blue",
        "red",
        "green",
        "yellow",
        "orange",
        "pink",
        "brown",
        "purple",
        "gray",
        "silver",
        "gold",
        "other",
      ],
    },
    ratings: [
      {
        star: Number,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
