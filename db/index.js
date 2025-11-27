const pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.EXTERNAL_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
