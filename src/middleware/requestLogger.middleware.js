const logger = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");
const requestLogger = (req, res, next) => {
  req.id = uuidv4();
  // 12312;
  logger.info({ requestId: req.id, method: req.method, url: req.url });
  next();
};

module.exports = requestLogger;
