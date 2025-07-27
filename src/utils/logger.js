import winston from "winston";
import path from "path";
import fs from "fs";

// Ensure that the logs directory exists
const logDir = "log";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a logger instance
const logger = winston.createLogger({
  level: "info", // Set the default log level (logs info and above)
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamps to logs
    winston.format.json() // Format logs as JSON
  ),
  transports: [
    // Log to console with colorized output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Colorize output for the console
        winston.format.simple() // Simplified output for the console
      ),
    }),
    // Log everything to logs/index.txt
    new winston.transports.File({
      filename: path.join(logDir, "index.txt"), // Path to logs/index.txt
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Timestamp for better readability
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
    }),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
    }),
  ],
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection: ${reason.message || reason}`);
});

// Export the logger
export default logger;
