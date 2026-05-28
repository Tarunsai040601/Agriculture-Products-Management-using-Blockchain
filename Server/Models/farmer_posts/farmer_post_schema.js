const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ quite: true });

const farmerPosts = new mongoose.Schema(
  {
    product: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    cost: { type: String, required: true },
    image: { type: String },
    createdBy: {
      type: String,
      ref: "FarmerModel",
    },
  },
  { timestamps: true },
);

let FarmerModel = new mongoose.model(process.env.FRAMERSCHEMA, farmerPosts);
module.exports = FarmerModel;
