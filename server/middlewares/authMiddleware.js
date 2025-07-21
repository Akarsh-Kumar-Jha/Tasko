const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.body?.token ||
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

      console.log("Token In Auth MIddleware:- ",token);


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. Token Not Found!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token!",
      error: error.message,
    });
  }
};
