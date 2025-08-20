import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: 'sa',
  password: 'abc@123',
  server: '10.151.7.100',
  database: 'ARGDatabase',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function testConnection() {
  try {
    console.log('Testing connection to SQL Server...');
    console.log('Server:', config.server);
    console.log('Database:', config.database);
    console.log('User:', config.user);
    
    const pool = await sql.connect(config);
    console.log('✅ Connection successful!');
    
    // Test query
    const result = await pool.request().query('SELECT TOP 1 * FROM Station');
    console.log('✅ Query successful!');
    console.log('Sample data:', result.recordset[0]);
    
    await pool.close();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Full error:', err);
  }
}

testConnection();
