// auth schema
const authSchema = require("../../Models/AuthSchema/authSchema.js");
// bcrypt.js
const bcrypt = require("bcryptjs");
// jsonwebtoken
const jwt = require("jsonwebtoken");
// dotenv
const dotenv = require("dotenv").config({ quiet: true });

// register controller
const RegisterController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("body_data:", {
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      role: req.body.role,
    });
    if (!name || !email || !password || !role) {
      return res.status(404).json({
        status: false,
        message: "all feilds required",
      });
    }
    // email vaildations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email format",
      });
    }
    // password vaildation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: false,
        message:
          "Password must contain uppercase, lowercase, number and special character",
      });
    }

    // find user
    const user = await authSchema.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: false,
        message: `user already exist with email:${user.email}`,
      });
    }
    // hashing password
    const ScertPassword = await bcrypt.hashSync(password, 10);
    console.log("ScertPassword:", ScertPassword);

    // inser user
    const insertUser = await authSchema.create({
      name,
      email,
      password: ScertPassword,
      role,
    });
    console.log("insertUser:", insertUser);
    res.status(200).json({
      status: true,
      message: "regiester sucessfully done",
      details: {
        name: insertUser.name,
        email: insertUser.email,
        password: insertUser.password,
        role: insertUser.role,
      },
    });
  } catch (error) {
    console.log("error in register:", error.message);
    res.status(404).json({
      status: false,
      message: "register failed",
      error_message: error.message,
    });
  }
};

// login controller
const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("body:", { email: req.body.email });
    if (!email || !password) {
      return res.status(404).json({
        status: false,
        message: "all feilds required",
      });
    }
    // email vaildations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email format",
      });
    }

    // find the user
    const user = await authSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: `user not found with this email`,
      });
    }
    // compare password
    const scertPasswordCompare = await bcrypt.compareSync(
      password,
      user.password,
    );
    if (!scertPasswordCompare) {
      return res.status(400).json({
        status: false,
        message: `invaild password or email`,
      });
    }
    console.log("userdetails:", user);
    // payload
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    // token
    const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "1d" });
    res.status(200).json({
      message: "login sucessfully",
      details: {
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.log("error in login:", error.message);
    res.status(404).json({
      status: false,
      message: "login failed",
      error_message: error.message,
    });
  }
};

// module exports
module.exports = { RegisterController, LoginController };
