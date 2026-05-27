const express = require("express");
const {
  RegisterController,
  LoginController,
} = require("../../Controllers/AuthController/authController.js");
const authRouter = express.Router();

// register router
authRouter.post("/register", RegisterController);

// login router
authRouter.post("/login", LoginController);

// module export
module.exports = authRouter;
