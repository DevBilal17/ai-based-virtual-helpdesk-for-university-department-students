const jwt = require("jsonwebtoken");
const response = require("../utils/response");
const User = require("../models/USER");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith("bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return response(res, 401, false, "No token provided");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return response(res, 401, false, "User not found");
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response(res, 401, false, "Token expired - Login again");
    }
    return response(res, 401, false, "Invalid token");
  }
};

module.exports = protect;