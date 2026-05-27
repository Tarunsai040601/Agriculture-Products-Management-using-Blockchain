// authschema with mongoose
const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ quiet: true });
// creating schema structure
const authSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: { type: String, enum: ["admin", "farmar", "customer", "dealer"] },
});

// creating a model
const AuthModel=mongoose.model(process.env.AGRICULTURESchema,authSchema);

// module exports
module.exports=AuthModel
