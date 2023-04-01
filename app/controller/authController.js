const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// const config = require("config");

module.exports = function (req, res, next) {
  // Get token from cookies
  const token = req.cookies.token;
  console.log("authController", req.cookies);

  // Check if no token
  if (!token) {
    req.user = {};
    next();
  } else {
    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid!" });
    }
  }
};
