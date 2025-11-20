const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

async function hashPassword(plain) {
  if (typeof plain !== "string" || !plain) {
    throw new Error("Password must be a non-empty string");
  }
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function verifyPassword(plain, hash) {
  if (!hash) return false;
  if (typeof plain !== "string" || !plain) return false;
  return bcrypt.compare(plain, hash);
}

module.exports = {
  hashPassword,
  verifyPassword
};
