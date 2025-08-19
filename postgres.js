const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connected at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
})();

module.exports = { pool };




