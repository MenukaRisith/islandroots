function parseTags(tags) {
  if (!tags || typeof tags !== "string") return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseGalleryJson(jsonValue) {
  if (!jsonValue) return [];
  if (Array.isArray(jsonValue)) return jsonValue.filter((v) => typeof v === "string");
  try {
    const arr = JSON.parse(jsonValue);
    if (!Array.isArray(arr)) return [];
    return arr.filter((v) => typeof v === "string");
  } catch {
    return [];
  }
}

function mapProductRow(row) {
  const price =
    row.price != null && row.price !== ""
      ? Number(row.price)
      : 0;

  const stock =
    row.stock != null
      ? Number(row.stock)
      : 0;

  const isFeatured =
    row.is_featured != null
      ? Boolean(row.is_featured)
      : false;

  const tags = parseTags(row.tags);
  const gallery = parseGalleryJson(row.gallery_json);
  const images = [];

  if (row.main_image_url) {
    images.push(row.main_image_url);
  }
  for (const img of gallery) {
    if (!images.includes(img)) {
      images.push(img);
    }
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    price,
    currency: row.currency || "LKR",
    stock,
    isFeatured,
    tags,
    images,
    vendorId: row.vendor_id || null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null
  };
}

function mapVendorRow(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    locationDistrict: row.location_district || null,
    story: row.story || "",
    avatarUrl: row.avatar_url || null,
    contactPhone: row.contact_phone || null,
    contactEmail: row.contact_email || null,
    instagram: row.instagram || null,
    tiktok: row.tiktok || null,
    tags: parseTags(row.tags),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null
  };
}

function mapOrderRow(row) {
  const totalAmount =
    row.total_amount != null && row.total_amount !== ""
      ? Number(row.total_amount)
      : 0;

  return {
    id: row.id,
    userId: row.user_id || null,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email || null,
    deliveryAddress: row.delivery_address,
    deliveryDistrict: row.delivery_district || null,
    paymentPreference: row.payment_preference,
    notes: row.notes || null,
    status: row.status,
    totalAmount,
    currency: row.currency || "LKR",
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null
  };
}

function mapOrderItemRow(row) {
  const unitPrice =
    row.unit_price != null && row.unit_price !== ""
      ? Number(row.unit_price)
      : 0;

  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name_snapshot,
    productSlug: row.product_slug_snapshot,
    quantity: Number(row.quantity || 0),
    unitPrice,
    currency: row.currency_snapshot || "LKR",
    tags: parseTags(row.tags_snapshot)
  };
}

module.exports = {
  parseTags,
  parseGalleryJson,
  mapProductRow,
  mapVendorRow,
  mapOrderRow,
  mapOrderItemRow
};
