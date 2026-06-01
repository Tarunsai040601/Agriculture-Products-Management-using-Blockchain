const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

const customerOrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phoneNo: { type: String, required: true, trim: true },
    homeAddress: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    farmerName: { type: String, required: true, trim: true },
    productCost: { type: String, trim: true },
    productImage: { type: String, trim: true },
    customerEmail: { type: String, required: true, trim: true },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "dealer_received",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true },
);

const CustomerOrderModel = mongoose.model(
  process.env.CUSTOMERORDERSchema || "CustomerOrderModel",
  customerOrderSchema,
);

module.exports = CustomerOrderModel;
