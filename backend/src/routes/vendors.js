const express = require("express");
const { requireAdmin } = require("../middleware/auth");
const {
  listVendors,
  findVendorById,
  findVendorBySlug,
  createVendor,
  updateVendor,
  deleteVendor
} = require("../repositories/vendors");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const vendors = await listVendors();
    res.json(vendors);
  } catch (err) {
    next(err);
  }
});

router.get("/slug/:slug", async (req, res, next) => {
  try {
    const vendor = await findVendorBySlug(req.params.slug);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(vendor);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const vendor = await findVendorById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(vendor);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const created = await createVendor(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const updated = await updateVendor(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await deleteVendor(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
