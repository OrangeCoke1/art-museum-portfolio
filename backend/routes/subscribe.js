import { Router } from "express";
import pool from "../db.js";

const router = Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
  const { email, source = "website" } = req.body || {};
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedSource =
    typeof source === "string" && source.trim() ? source.trim().slice(0, 100) : "website";

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  try {
    const existing = await pool.query(
      "SELECT id FROM subscriptions WHERE email = $1 LIMIT 1",
      [normalizedEmail],
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed.",
      });
    }

    await pool.query(
      "INSERT INTO subscriptions (email, source, status) VALUES ($1, $2, 'active')",
      [normalizedEmail, normalizedSource],
    );

    return res.status(200).json({
      success: true,
      message: "Subscription successful.",
    });
  } catch (error) {
    if (error?.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed.",
      });
    }

    console.error("[subscribe]", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});

export default router;
