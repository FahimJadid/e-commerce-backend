const mongoose = require("mongoose");

const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        color: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    cartTotal: {
      type: Number,
    },
    totalAfterDiscount: {
      type: Number,
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
