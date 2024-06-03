const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function query(sql, ...values) {
  try {
    // For pool initialization, see above
    const [rows, fields] = await pool.query('SELECT * FROM `User`', values);
    return rows
    // Connection is automatically released when query resolves
  } catch (err) {
    console.log(err);
  }
}

module.exports = {query}