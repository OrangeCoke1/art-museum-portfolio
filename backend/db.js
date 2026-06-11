import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn(
    "[db] DATABASE_URL is not set. Copy backend/.env.example to .env and add your Supabase connection string.",
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DB_SSL === "false"
      ? false
      : { rejectUnauthorized: false },
  max: 10,
});

export default pool;
