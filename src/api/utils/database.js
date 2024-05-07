import mysql from "mysql2";
import "dotenv/config";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database not available", err);
    return;
  }
  console.log("Database connection created succesfully");
  connection.release();
});

console.log("process.env", process.env.DB_HOST);
console.log("process.env", process.env.DB_USER);
console.log("process.env", process.env.DB_PASSWORD);
console.log("process.env", process.env.DB_NAME);
const promisePool = pool.promise();
export default promisePool;
