const mongoose = require("mongoose");

const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
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
      default: 0,
    },
    totalAfterDiscount: {
      type: Number,
      default: 0,
    },
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
