const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

pool.connect()
  .then(() => {
    console.log("Connected to the PostgreSQL database!")
  })
  .catch((error) => {
    console.error("PostgreSQL connection FAILED:", error);
    process.exit(1); // Exit on failure
  });

module.exports = pool;
