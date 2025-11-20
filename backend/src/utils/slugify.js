function slugify(str) {
  if (typeof str !== "string") return "";

  return str
    .normalize("NFD")                        // remove accents
    .replace(/[\u0300-\u036f]/g, "")         // remove combining diacritical marks
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")             // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "")                 // remove leading/trailing hyphens
    .replace(/-+/g, "-");                    // collapse multiple hyphens
}

module.exports = { slugify };
