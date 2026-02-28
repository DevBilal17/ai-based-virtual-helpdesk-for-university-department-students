const response = require("../utils/response");

const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is attached (protect middleware should run before this)
    if (!req.user) {
      return response(res, 401, false, "Not authenticated");
    }

    // Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return response(
        res,
        403,
        false,
        `Access denied - Requires role: ${roles.join(", ")}`
      );
    }

    next();
  };
};

module.exports = authorize;