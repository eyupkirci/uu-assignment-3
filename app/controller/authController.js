const jwt = require("jsonwebtoken");

// const config = require("config");

module.exports = function (req, res, next) {
  // Get token from cookies
  const token = req.cookies.token;
  console.log("authController", req.cookies);

  // Check if no token
  if (!token) {
    // return res.status(401).json({ msg: "No token, authorization denied!" });
    req.user = {};
    next();
  } else {
    // Verify token
    try {
      const decoded = jwt.verify(token, "uu-assignment-3");
      req.user = decoded.user;

      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid!" });
    }
  }
};
