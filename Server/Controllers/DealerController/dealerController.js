const authSchema=require('../../Models/AuthSchema/authSchema.js')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// fetch all farmers
const fetchDealers = async (req, res) => {
  try {

    const fetch_all_dealers = await authSchema.find(
      {
        createdBy: req.user.id,
        role: ["dealer"],
      },
      {
        name: 1,
        email: 1,
        role: 1,
      }
    );

    console.log("fetch_all_dealers:", fetch_all_dealers);

    res.status(200).json({
      status: true,
      message: "fetch_all_dealers",
      data: fetch_all_dealers,
    });

  } catch (error) {

    console.log("fetch_all_dealers_error:", error.message);

    res.status(500).json({
      status: false,
      message: "fetch_all_dealers error",
      err_message: error.message,
    });

  }
};

// create all farmers
const createDealer = async (req, res) => {
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
      createdBy: req.user.id,
    });
    console.log("insertUser:", insertUser);
    res.status(200).json({
      status: true,
      message: "created dealer sucessfully done",
      details: {
        name: insertUser.name,
        email: insertUser.email,
        password: insertUser.password,
        role: insertUser.role,
        
      },
    });
  } catch (error) {
    console.log("error in dealer farmer:", error.message);
    res.status(404).json({
      status: false,
      message: "create dealer failed",
      error_message: error.message,
    });
  }
};

// module export
module.exports = {createDealer,fetchDealers };