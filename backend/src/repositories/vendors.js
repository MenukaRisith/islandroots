const { query, execute } = require("../config/db");
const { mapVendorRow } = require("../utils/formatters");

function tagsArrayToString(tags) {
  if (!Array.isArray(tags)) return "";
  return tags
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter((t) => t.length > 0)
    .join(",");
}

async function listVendors() {
  const rows = await query(
    "SELECT id, name, slug, location_district, story, avatar_url, contact_phone, contact_email, instagram, tiktok, tags, owner_user_id, created_at, updated_at FROM vendors ORDER BY created_at DESC"
  );
  return rows.map(mapVendorRow);
}

async function findVendorById(id) {
  const rows = await query(
    "SELECT id, name, slug, location_district, story, avatar_url, contact_phone, contact_email, instagram, tiktok, tags, owner_user_id, created_at, updated_at FROM vendors WHERE id = ? LIMIT 1",
    [id]
  );
  return rows.length > 0 ? mapVendorRow(rows[0]) : null;
}

async function findVendorBySlug(slug) {
  const rows = await query(
    "SELECT id, name, slug, location_district, story, avatar_url, contact_phone, contact_email, instagram, tiktok, tags, owner_user_id, created_at, updated_at FROM vendors WHERE slug = ? LIMIT 1",
    [slug]
  );
  return rows.length > 0 ? mapVendorRow(rows[0]) : null;
}

async function createVendor(input) {
  const tagsStr = tagsArrayToString(input.tags || []);

  const result = await execute(
    `
    INSERT INTO vendors (
      name,
      slug,
      location_district,
      story,
      avatar_url,
      contact_phone,
      contact_email,
      instagram,
      tiktok,
      tags,
      owner_user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      input.name,
      input.slug,
      input.locationDistrict || null,
      input.story || null,
      input.avatarUrl || null,
      input.contactPhone || null,
      input.contactEmail || null,
      input.instagram || null,
      input.tiktok || null,
      tagsStr || null,
      input.ownerUserId || null
    ]
  );

  const rows = await query(
    "SELECT id, name, slug, location_district, story, avatar_url, contact_phone, contact_email, instagram, tiktok, tags, owner_user_id, created_at, updated_at FROM vendors WHERE id = ? LIMIT 1",
    [result.insertId]
  );
  return rows.length > 0 ? mapVendorRow(rows[0]) : null;
}

async function updateVendor(id, input) {
  const tagsStr = tagsArrayToString(input.tags || []);

  await execute(
    `
    UPDATE vendors
    SET
      name = ?,
      slug = ?,
      location_district = ?,
      story = ?,
      avatar_url = ?,
      contact_phone = ?,
      contact_email = ?,
      instagram = ?,
      tiktok = ?,
      tags = ?,
      owner_user_id = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
    [
      input.name,
      input.slug,
      input.locationDistrict || null,
      input.story || null,
      input.avatarUrl || null,
      input.contactPhone || null,
      input.contactEmail || null,
      input.instagram || null,
      input.tiktok || null,
      tagsStr || null,
      input.ownerUserId || null,
      id
    ]
  );

  const rows = await query(
    "SELECT id, name, slug, location_district, story, avatar_url, contact_phone, contact_email, instagram, tiktok, tags, owner_user_id, created_at, updated_at FROM vendors WHERE id = ? LIMIT 1",
    [id]
  );
  return rows.length > 0 ? mapVendorRow(rows[0]) : null;
}

async function deleteVendor(id) {
  await execute("DELETE FROM vendors WHERE id = ?", [id]);
  return true;
}

module.exports = {
  listVendors,
  findVendorById,
  findVendorBySlug,
  createVendor,
  updateVendor,
  deleteVendor
};
