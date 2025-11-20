const { pool, query } = require("../config/db");

async function createOrderWithItems(userId, payload) {
  const body = payload || {};
  const items = Array.isArray(body.items) ? body.items : [];

  if (items.length === 0) {
    const err = new Error("At least one item is required.");
    err.statusCode = 400;
    throw err;
  }

  if (!body.customerName || !body.customerPhone || !body.deliveryAddress) {
    const err = new Error("Missing required customer fields.");
    err.statusCode = 400;
    throw err;
  }

  const productIds = Array.from(
    new Set(
      items
        .map((i) => Number(i.productId))
        .filter((id) => Number.isFinite(id) && id > 0)
    )
  );

  if (productIds.length === 0) {
    const err = new Error("Invalid product list.");
    err.statusCode = 400;
    throw err;
  }

  const placeholders = productIds.map(() => "?").join(",");
  const productRows = await query(
    `
    SELECT id, name, slug, price, currency, tags
    FROM products
    WHERE id IN (${placeholders})
  `,
    productIds
  );

  if (productRows.length !== productIds.length) {
    const err = new Error("One or more products no longer exist.");
    err.statusCode = 400;
    throw err;
  }

  const productsById = new Map();
  for (const row of productRows) {
    productsById.set(row.id, row);
  }

  let currency = null;
  let totalAmount = 0;

  const normalizedItems = items.map((i) => {
    const pid = Number(i.productId);
    const qtyRaw = Number(i.quantity);
    const quantity = Number.isFinite(qtyRaw) && qtyRaw > 0 ? qtyRaw : 1;

    const product = productsById.get(pid);
    if (!product) {
      const err = new Error("One or more products no longer exist.");
      err.statusCode = 400;
      throw err;
    }

    const price = Number(product.price || 0);
    const lineCurrency = product.currency || "LKR";

    if (!currency) {
      currency = lineCurrency;
    } else if (currency !== lineCurrency) {
      const err = new Error("All items must use the same currency.");
      err.statusCode = 400;
      throw err;
    }

    totalAmount += price * quantity;

    return {
      productId: pid,
      quantity,
      unitPrice: price,
      currency: lineCurrency,
      name: product.name,
      slug: product.slug,
      tagsSnapshot: product.tags || null
    };
  });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.execute(
      `
      INSERT INTO orders (
        user_id,
        customer_name,
        customer_phone,
        customer_email,
        delivery_address,
        delivery_district,
        payment_preference,
        notes,
        status,
        total_amount,
        currency
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)
    `,
      [
        userId || null,
        body.customerName,
        body.customerPhone,
        body.customerEmail || null,
        body.deliveryAddress,
        body.deliveryDistrict || null,
        body.paymentPreference || "COD",
        body.notes || null,
        totalAmount,
        currency || "LKR"
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of normalizedItems) {
      await conn.execute(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name_snapshot,
          product_slug_snapshot,
          quantity,
          unit_price,
          currency_snapshot,
          tags_snapshot
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          orderId,
          item.productId,
          item.name,
          item.slug,
          item.quantity,
          item.unitPrice,
          item.currency,
          item.tagsSnapshot
        ]
      );
    }

    await conn.commit();
    conn.release();

    return { id: orderId };
  } catch (err) {
    try {
      await conn.rollback();
    } catch {
      // ignore
    }
    conn.release();
    throw err;
  }
}

module.exports = {
  createOrderWithItems
};
