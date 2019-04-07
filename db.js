const mysql = require('mysql2/promise');

const getConnection = async () => mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const insert = async (object) => {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    'INSERT INTO `interests` (source, month, year, interest_amount, net_profit) VALUES (?,?,?,?,?)',
    Object.values(object),
  );

  return rows.affectedRows;
};

module.exports = { insert };
