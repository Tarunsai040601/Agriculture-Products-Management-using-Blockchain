// authschema with mongoose

const mongoose = require("mongoose");

const dotenv = require("dotenv").config({ quiet: true });

// creating schema structure

const authSchema = new mongoose.Schema({

  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "farmer", "customer", "dealer"],
  },

  // which admin created this user

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthModel",
  },

});

// creating a model

const AuthModel = mongoose.model(
  process.env.AGRICULTURESchema,
  authSchema
);

// module exports

module.exports = AuthModel;