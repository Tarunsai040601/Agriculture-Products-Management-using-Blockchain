const authSchema = require("../../Models/AuthSchema/authSchema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// fetch all farmers
const fetchFarmers = async (req, res) => {
  try {
  } catch (error) {}
};

// create all farmers
const createFarmer = async (req, res) => {
  try {
    const { name, email, password,role} = req.body;
    if (!name || !email || !password||!role) {
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
      message: "created farmer sucessfully done",
      details: {
        name: insertUser.name,
        email: insertUser.email,
        password: insertUser.password,
        role: insertUser.role,
      },
    });
  } catch (error) {
    console.log("error in create farmer:", error.message);
    res.status(404).json({
      status: false,
      message: "create farmer failed",
      error_message: error.message,
    });
  }
};

// module export
module.exports = { createFarmer, fetchFarmers };
