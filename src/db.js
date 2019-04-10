const mysql = require('mysql2/promise');

/**
 * Create new MySQL connection
 */
const getConnection = async () => mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

/**
 * Insert data safely to DB
 * @param {*} object
 */
const insertDailyInterest = async (connection, object) => {
  const [rows] = await connection.execute(
    'INSERT INTO `daily_interests` (date, source, total, net) VALUES (?,?,?,?)',
    Object.values(object),
  );

  return rows.affectedRows;
};

const insertPortfolioValue = async (connection, object) => {
  const [rows] = await connection.execute(
    'INSERT INTO `portfolio_values` (date, source, value) VALUES (?,?,?)',
    Object.values(object),
  );

  return rows.affectedRows;
};

module.exports = {
  getConnection,
  insertDailyInterest,
  insertPortfolioValue,
};
