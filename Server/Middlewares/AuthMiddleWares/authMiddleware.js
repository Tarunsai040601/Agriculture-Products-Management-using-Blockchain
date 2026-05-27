const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ quiet: true });

const JWT_SCERT = process.env.JWT_TOKEN;
console.log("JWT_TOKEN:", JWT_SCERT);

// auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const AuthHeaders = await req.headers.authorization;
    console.log("AuthHeaders:", AuthHeaders);
    if (!AuthHeaders) {
      res.status(404).json({
        status: false,
        message: "authHeaders required",
      });
    }
    const token = await AuthHeaders.split(" ")[1];
    console.log("token:", token);
    if (!token) {
      res.status(404).json({
        status: false,
        message: "token required",
      });
    }
    const decode = jwt.verify(token, JWT_SCERT);
    console.log("decode:", decode);
    req.user = decode;

    next();
  } catch (error) {
    console.log("middleware error:", error);
    return res
      .status(403)
      .json({
        status: false,
        message: "Invalid token",
        error_message: error.message,
      });
  }
};

// module export
module.exports=authMiddleware
