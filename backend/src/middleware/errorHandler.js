const { ENV } = require("../config/env");

function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const message =
    typeof err.message === "string" && err.message.trim().length > 0
      ? err.message
      : "Something went wrong. Please try again later.";

  const payload = { error: message };

  if (ENV.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack.split("\n");
  }

  res.status(status).json(payload);
}

module.exports = {
  errorHandler
};
