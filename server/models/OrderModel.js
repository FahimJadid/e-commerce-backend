const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    paymentIntent: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
