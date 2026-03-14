const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  logger.error({
    requestId: req.id,
    message
  });
  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
