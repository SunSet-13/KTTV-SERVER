// Cài đặt: npm install express mssql cors
require('dotenv').config();
import sql from "mssql";

export const config = {
  user: 'sa',
  password: '123@abc',
  server: '10.151.7.100',
  database: 'ARGDatabase',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

export async function connectSQL() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error("Kết nối SQL Server lỗi:", err);
    throw err;
  }
}

export default sql;
