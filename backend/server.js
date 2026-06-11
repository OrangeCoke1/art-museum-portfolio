import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import subscribeRouter from "./routes/subscribe.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

app.use(
  cors({
    origin: corsOrigins,
  }),
);
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({ ok: false, db: false, error: "missing_database_url" });
    }
    await pool.query("SELECT 1");
    res.json({ ok: true, db: true });
  } catch (error) {
    console.error("[health]", error);
    res.status(503).json({ ok: false, db: false });
  }
});

app.use("/api/subscribe", subscribeRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Not found." });
});

app.listen(PORT, () => {
  console.log(`Gallery Walk API listening on http://localhost:${PORT}`);
});
