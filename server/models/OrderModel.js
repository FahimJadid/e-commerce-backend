const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
        },
      },
    ],

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cash on Delivery",
        "Cancelled",
      ],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "Bkash", "Nagad", "PayPal", "Cash on Delivery"],
      default: "Cash on Delivery",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
