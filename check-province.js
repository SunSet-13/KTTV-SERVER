import sql from 'mssql';

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

async function checkAllColumns() {
  try {
    const pool = await sql.connect(config);
    
    // Check all column information for Station table
    const columnInfo = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Station'
      ORDER BY ORDINAL_POSITION
    `);
    console.log('All Station column information:');
    console.table(columnInfo.recordset);
    
    // Check sample data for problematic fields
    const result = await pool.request().query('SELECT TOP 3 StationID, ProvinceID, Status, RegID, Project, StationNo FROM Station WHERE Project IS NOT NULL');
    console.log('\nSample data:');
    result.recordset.forEach(row => {
      console.log('StationID:', row.StationID, 'ProvinceID:', row.ProvinceID, 'Status:', row.Status, 'RegID:', row.RegID, 'Project:', row.Project, 'typeof Project:', typeof row.Project, 'StationNo:', row.StationNo);
    });
    
    await pool.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkAllColumns();
