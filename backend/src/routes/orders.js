const express = require("express");
const { createOrderWithItems } = require("../services/orderService");
const { requireAdmin } = require("../middleware/auth");
const {
  listAllOrders,
  findOrderWithItemsById
} = require("../repositories/orders");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const order = await createOrderWithItems(userId, req.body);
    res.status(201).json({ orderId: String(order.id) });
  } catch (err) {
    next(err);
  }
});

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const status =
      typeof req.query.status === "string" ? req.query.status : null;

    const orders = await listAllOrders();
    const filtered = status
      ? orders.filter((o) => o.status === status)
      : orders;

    res.json(filtered);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAdmin, async (req, res, next) => {
  try {
    const idNum = Number(req.params.id);
    if (!Number.isFinite(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "Invalid order id" });
    }

    const result = await findOrderWithItemsById(idNum);
    if (!result) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { order, items } = result;
    res.json({
      ...order,
      items
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
