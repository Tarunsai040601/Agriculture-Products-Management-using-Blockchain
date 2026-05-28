const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ quiet: true });

const JWT_SCERT = process.env.JWT_TOKEN;
console.log("JWT_TOKEN:", JWT_SCERT);

// auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const AuthHeaders = req.headers.authorization;
    console.log("AuthHeaders:", AuthHeaders);
    if (!AuthHeaders) {
      return res.status(401).json({
        status: false,
        message: "authHeaders required",
      });
    }
    const token = AuthHeaders.split(" ")[1];
    console.log("token:", token);
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "token required",
      });
    }
    const decode = jwt.verify(token, JWT_SCERT);
    console.log("decode:", decode);
    req.user = decode;

    return next();
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
