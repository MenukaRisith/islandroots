const { query, execute } = require("../config/db");

async function findUserByEmail(email) {
  const rows = await query(
    "SELECT id, name, email, password_hash, role, is_active, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
}

async function findUserById(id) {
  const rows = await query(
    "SELECT id, name, email, password_hash, role, is_active, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

async function createUser({ name, email, passwordHash, role }) {
  const nowRole = role || "USER";
  const result = await execute(
    "INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)",
    [name, email, passwordHash, nowRole]
  );

  const rows = await query(
    "SELECT id, name, email, password_hash, role, is_active, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
    [result.insertId]
  );
  return rows.length > 0 ? rows[0] : null;
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};
