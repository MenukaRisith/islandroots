const express = require("express");

const authRouter = require("./auth");
const productsRouter = require("./products");
const vendorsRouter = require("./vendors");
const ordersRouter = require("./orders");
const meRouter = require("./me");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok", scope: "api" });
});

router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/vendors", vendorsRouter);
router.use("/orders", ordersRouter);
router.use("/me", meRouter);

module.exports = router;
