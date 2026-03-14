const winston = require("winston");
const dailyRotateFile = require("winston-daily-rotate-file");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new dailyRotateFile({
      filename: "src/logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "10m",
      maxFiles: "14d"
    }),

    new dailyRotateFile({
      filename: "src/logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d"
    })
  ]
});

module.exports = logger;
