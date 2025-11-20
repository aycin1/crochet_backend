const pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  port: 4000,
  user: process.env.POOL_USERNAME,
  password: process.env.POOL_PASSWORD,
  database: "fibre fantasies",
});

module.exports = pool;
