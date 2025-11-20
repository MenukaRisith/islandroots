const { query, execute } = require("../config/db");
const { mapProductRow } = require("../utils/formatters");
const { slugify } = require("../utils/slugify");

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v) => v.length > 0);
}

function tagsToString(tags) {
  if (!Array.isArray(tags)) return "";
  return tags
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter((t) => t.length > 0)
    .join(",");
}

// Safely convert undefined → null for SQL
function safe(v) {
  return v === undefined ? null : v;
}

async function listProducts() {
  const rows = await query(
    "SELECT id, vendor_id, name, slug, description, price, currency, stock, is_featured, tags, main_image_url, gallery_json, created_at, updated_at FROM products ORDER BY created_at DESC"
  );
  return rows.map(mapProductRow);
}

async function findProductBySlug(slug) {
  const rows = await query(
    "SELECT id, vendor_id, name, slug, description, price, currency, stock, is_featured, tags, main_image_url, gallery_json, created_at, updated_at FROM products WHERE slug = ? LIMIT 1",
    [slug]
  );
  return rows.length > 0 ? mapProductRow(rows[0]) : null;
}

async function findProductById(id) {
  const rows = await query(
    "SELECT id, vendor_id, name, slug, description, price, currency, stock, is_featured, tags, main_image_url, gallery_json, created_at, updated_at FROM products WHERE id = ? LIMIT 1",
    [id]
  );
  return rows.length > 0 ? mapProductRow(rows[0]) : null;
}

async function createProduct(input) {
  const images = normalizeImages(input.images);
  const mainImageUrl = images[0] || null;
  const galleryJson = JSON.stringify(images.slice(1) || []);
  const tagsStr = tagsToString(input.tags);

  const slug =
    typeof input.slug === "string" && input.slug.length > 0
      ? input.slug
      : slugify(input.name);

  const params = [
    safe(input.vendorId) ? Number(input.vendorId) : null,
    input.name,
    slug,
    safe(input.description),
    Number(input.price),
    input.currency || "LKR",
    input.stock !== "" && input.stock != null ? Number(input.stock) : null,
    input.isFeatured ? 1 : 0,
    tagsStr || null,
    mainImageUrl,
    galleryJson,
  ].map(safe); // 🔥 guarantee no undefined

  const result = await execute(
    `
      INSERT INTO products (
        vendor_id,
        name,
        slug,
        description,
        price,
        currency,
        stock,
        is_featured,
        tags,
        main_image_url,
        gallery_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    params
  );

  const rows = await query(
    "SELECT * FROM products WHERE id = ? LIMIT 1",
    [result.insertId]
  );
  return rows.length > 0 ? mapProductRow(rows[0]) : null;
}

async function updateProduct(id, input) {
  const images = normalizeImages(input.images);
  const mainImageUrl = images[0] || null;
  const galleryJson = JSON.stringify(images.slice(1) || []);
  const tagsStr = tagsToString(input.tags);

  const slug =
    typeof input.slug === "string" && input.slug.length > 0
      ? input.slug
      : slugify(input.name);

  const params = [
    safe(input.vendorId) ? Number(input.vendorId) : null,
    input.name,
    slug,
    safe(input.description),
    Number(input.price),
    input.currency || "LKR",
    input.stock !== "" && input.stock != null ? Number(input.stock) : null,
    input.isFeatured ? 1 : 0,
    tagsStr || null,
    mainImageUrl,
    galleryJson,
    id,
  ].map(safe); // 🔥 no undefined ever

  await execute(
    `
      UPDATE products
      SET
        vendor_id = ?,
        name = ?,
        slug = ?,
        description = ?,
        price = ?,
        currency = ?,
        stock = ?,
        is_featured = ?,
        tags = ?,
        main_image_url = ?,
        gallery_json = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    params
  );

  const rows = await query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  return rows.length > 0 ? mapProductRow(rows[0]) : null;
}

async function deleteProduct(id) {
  await execute("DELETE FROM products WHERE id = ?", [id]);
  return true;
}

module.exports = {
  listProducts,
  findProductBySlug,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
