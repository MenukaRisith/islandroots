const mysql = require("mysql2/promise");
const { ENV } = require("./env");

const pool = mysql.createPool({
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  connectionLimit: 10,
  charset: "utf8mb4_unicode_ci"
});

async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function execute(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

module.exports = {
  pool,
  query,
  execute
};
