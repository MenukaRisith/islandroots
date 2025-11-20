const { query } = require("../config/db");
const { mapOrderRow, mapOrderItemRow } = require("../utils/formatters");

function buildOrderSummaries(orderRows, itemsRows) {
  if (orderRows.length === 0) return [];

  const orders = orderRows.map(mapOrderRow);
  const items = itemsRows.map(mapOrderItemRow);

  const itemsByOrderId = new Map();
  for (const item of items) {
    if (!itemsByOrderId.has(item.orderId)) {
      itemsByOrderId.set(item.orderId, []);
    }
    itemsByOrderId.get(item.orderId).push(item);
  }

  return orders.map((order) => {
    const orderItems = itemsByOrderId.get(order.id) || [];
    const totalItems = orderItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    const itemsPreview = orderItems.slice(0, 3).map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productSlug: item.productSlug,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      currency: item.currency,
      tags: item.tags || []
    }));

    return {
      id: String(order.id),
      createdAt: order.createdAt,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
      totalItems,
      paymentPreference: order.paymentPreference,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      deliveryDistrict: order.deliveryDistrict,
      itemsPreview
    };
  });
}

async function listOrdersForUser(userId) {
  const ordersRows = await query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  if (ordersRows.length === 0) {
    return [];
  }

  const orderIds = ordersRows.map((o) => o.id);
  const placeholders = orderIds.map(() => "?").join(",");

  const itemsRows = await query(
    `SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`,
    orderIds
  );

  return buildOrderSummaries(ordersRows, itemsRows);
}

async function listAllOrders() {
  const ordersRows = await query(
    "SELECT * FROM orders ORDER BY created_at DESC"
  );

  if (ordersRows.length === 0) {
    return [];
  }

  const orderIds = ordersRows.map((o) => o.id);
  const placeholders = orderIds.map(() => "?").join(",");

  const itemsRows = await query(
    `SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`,
    orderIds
  );

  return buildOrderSummaries(ordersRows, itemsRows);
}

async function findOrderWithItemsById(orderId) {
  const ordersRows = await query(
    "SELECT * FROM orders WHERE id = ? LIMIT 1",
    [orderId]
  );

  if (ordersRows.length === 0) {
    return null;
  }

  const order = mapOrderRow(ordersRows[0]);
  const itemsRows = await query(
    "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC",
    [orderId]
  );
  const items = itemsRows.map(mapOrderItemRow);

  return { order, items };
}

module.exports = {
  listOrdersForUser,
  listAllOrders,
  findOrderWithItemsById
};
