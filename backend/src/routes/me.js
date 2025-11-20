const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { listOrdersForUser } = require("../repositories/orders");

const router = express.Router();

router.get("/orders", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await listOrdersForUser(userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
