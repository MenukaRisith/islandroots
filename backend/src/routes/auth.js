const express = require("express");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signJwt } = require("../utils/jwt");
const { findUserByEmail, findUserById, createUser } = require("../repositories/users");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Name is required." });
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email is already in use." });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ name: name.trim(), email: email.trim(), passwordHash });

    if (!user) {
      return res
        .status(500)
        .json({ error: "Failed to create user. Please try again." });
    }

    const token = signJwt({ sub: user.id, role: user.role });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "ADMIN"
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required." });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signJwt({ sub: user.id, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "ADMIN"
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user || !user.is_active) {
      return res.status(401).json({ error: "User not found." });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.role === "ADMIN"
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
