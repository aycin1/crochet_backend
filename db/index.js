const pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  port: 4000,
  user: "postgres",
  password: "9CvL!yq73",
  database: "fibre fantasies",
});

module.exports = pool;
