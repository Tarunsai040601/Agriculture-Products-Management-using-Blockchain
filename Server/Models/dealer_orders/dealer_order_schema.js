const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

const dealerOrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phoneNo: { type: String, required: true, trim: true },
    homeAddress: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    dealerName: { type: String, required: true, trim: true },
    dealerEmail: { type: String, required: true, trim: true },
    farmerName: { type: String, required: true, trim: true },
    orderStatus: {
      type: String,
      enum: ["pending", "received", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const DealerOrderModel = mongoose.model(
  process.env.DEALERORDERSchema || "DealerOrderModel",
  dealerOrderSchema,
);

module.exports = DealerOrderModel;
