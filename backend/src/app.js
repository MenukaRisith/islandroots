const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { ENV } = require("./config/env");
const apiRouter = require("./routes");
const { authOptional } = require("./middleware/auth");
const { notFoundHandler } = require("./middleware/notFoundHandler");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: ENV.NODE_ENV });
});

app.use("/api", authOptional, apiRouter);

app.use("/api", notFoundHandler);

app.use(errorHandler);

module.exports = { app };
