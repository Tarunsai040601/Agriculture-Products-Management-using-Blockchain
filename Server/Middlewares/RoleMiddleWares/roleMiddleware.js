const roleMiddleware = (roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Unauthorized access",
          // error_message:error.message
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: "role middleware Something went wrong",
        error_message:error.message
      });
    }
  };
};

module.exports = roleMiddleware;