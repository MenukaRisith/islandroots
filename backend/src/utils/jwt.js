const jwt = require("jsonwebtoken");
const { ENV } = require("../config/env");

function signJwt(payload, expiresIn) {
  if (!payload || typeof payload !== "object") {
    throw new Error("JWT payload must be an object");
  }
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: expiresIn || ENV.JWT_EXPIRES_IN
  });
}

function verifyJwt(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}

module.exports = {
  signJwt,
  verifyJwt
};
