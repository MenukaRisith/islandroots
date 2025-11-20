const express = require("express");
const { requireAdmin } = require("../middleware/auth");
const {
  listProducts,
  findProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../repositories/products");

const router = express.Router();

// Simple per-request logger for this router
router.use((req, res, next) => {
  console.log(
    `[products] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`
  );
  next();
});

router.get("/", async (req, res, next) => {
  try {
    console.log("[products][GET /] query:", req.query);

    const products = await listProducts();
    console.log("[products][GET /] total products from repo:", products.length);

    const tag =
      typeof req.query.tag === "string" && req.query.tag.trim().length > 0
        ? req.query.tag.trim()
        : null;

    const search =
      typeof req.query.search === "string" &&
      req.query.search.trim().length > 0
        ? req.query.search.trim().toLowerCase()
        : null;

    console.log("[products][GET /] filters:", { tag, search });

    let filtered = products;

    if (tag) {
      filtered = filtered.filter(
        (p) => Array.isArray(p.tags) && p.tags.includes(tag)
      );
      console.log(
        `[products][GET /] after tag filter (${tag}) count:`,
        filtered.length
      );
    }

    if (search) {
      filtered = filtered.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return name.includes(search) || desc.includes(search);
      });
      console.log(
        `[products][GET /] after search filter ("${search}") count:`,
        filtered.length
      );
    }

    res.json(filtered);
  } catch (err) {
    console.error("[products][GET /] error:", err);
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    console.log("[products][GET /:slug] slug:", req.params.slug);
    const product = await findProductBySlug(req.params.slug);

    if (!product) {
      console.warn(
        "[products][GET /:slug] not found for slug:",
        req.params.slug
      );
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("[products][GET /:slug] error:", err);
    next(err);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    console.log("[products][POST /] body:", req.body);
    const created = await createProduct(req.body);
    console.log("[products][POST /] created product id:", created?.id);
    res.status(201).json(created);
  } catch (err) {
    console.error("[products][POST /] error:", err);
    next(err);
  }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    console.log("[products][PUT /:id] id:", req.params.id);
    console.log("[products][PUT /:id] body:", req.body);

    const updated = await updateProduct(req.params.id, req.body);
    console.log("[products][PUT /:id] updated product:", updated?.id);

    res.json(updated);
  } catch (err) {
    console.error("[products][PUT /:id] error:", err);
    next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    console.log("[products][DELETE /:id] id:", req.params.id);
    await deleteProduct(req.params.id);
    console.log("[products][DELETE /:id] deleted successfully");
    res.json({ ok: true });
  } catch (err) {
    console.error("[products][DELETE /:id] error:", err);
    next(err);
  }
});

module.exports = router;
