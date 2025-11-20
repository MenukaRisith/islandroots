const { verifyJwt } = require("../utils/jwt");

function authOptional(req, _res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme === "Bearer" && token) {
    const payload = verifyJwt(token);
    if (payload && typeof payload.sub === "number") {
      req.user = {
        id: payload.sub,
        role: payload.role || "USER"
      };
    } else {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  return next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  return next();
}

module.exports = {
  authOptional,
  requireAuth,
  requireAdmin
};
