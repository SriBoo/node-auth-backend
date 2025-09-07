import express from "express";
import bcrypt from "bcrypt";
import { validateEmail, validatePassword } from "../utils/validators.js";

export default function authRoutes(db) {
  const router = express.Router();

  // helper to wrap db.get as promise
  function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // helper to wrap db.run as promise
  function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this); // so we can access lastID
      });
    });
  }

  // ✅ Register
  router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    try {
      const existing = await dbGet("SELECT id FROM users WHERE email = ?", [email]);
      if (existing) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const hash = await bcrypt.hash(password, 10);
      const result = await dbRun(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)",
        [email, hash]
      );

      return res.status(201).json({ ok: true, userId: result.lastID });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // ✅ Login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await dbGet("SELECT * FROM users WHERE email = ?", [email]);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.email = user.email;

      return res.json({ ok: true, user: { id: user.id, email: user.email } });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // ✅ Me (session check)
  router.get("/me", (req, res) => {
    if (req.session.userId) {
      return res.json({ id: req.session.userId, email: req.session.email });
    }
    return res.status(401).json({ error: "Not logged in" });
  });

  // ✅ Logout
  router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.json({ ok: true });
    });
  });

  // ✅ Dashboard (protected)
  router.get("/dashboard", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not logged in" });
    }
    return res.json({
      message: `Welcome ${req.session.email}! This is your dashboard.`,
    });
  });

  return router;
}
