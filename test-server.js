import express from 'express';
import dotenv from 'dotenv';
import { getRainData } from './src/services/mapService.js';
import { getStationRainData } from './src/services/stationRainService.js';
import { getStationData } from './src/services/stationDataService.js';
import { getRain1hData } from './src/services/chartService.js';

dotenv.config();

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Test routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Test Server Running',
    endpoints: [
      'GET /',
      'GET /api/map',
      'GET /api/station-data', 
      'GET /api/chart',
      'GET /api/station-rain'
    ]
  });
});

app.get('/api/map', async (req, res) => {
  try {
    console.log('📍 API /api/map called');
    const data = await getRainData();
    console.log(`✅ Map API: Found ${data.length} stations`);
    res.json({ rainValues: data });
  } catch (error) {
    console.error('❌ Map API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/station-data', async (req, res) => {
  try {
    console.log('📊 API /api/station-data called');
    const data = await getStationData();
    console.log(`✅ Station Data API: Found ${data.length} stations`);
    res.json({ stationData: data });
  } catch (error) {
    console.error('❌ Station Data API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/chart', async (req, res) => {
  try {
    console.log('📈 API /api/chart called');
    const data = await getRain1hData();
    console.log(`✅ Chart API: Found ${data.length} records`);
    res.json({ rainValue: data });
  } catch (error) {
    console.error('❌ Chart API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/station-rain', async (req, res) => {
  try {
    console.log('🔗 API /api/station-rain called with query:', req.query);
    
    const { startDate, endDate, startTime, endTime, limit } = req.query;
    const filters = {};
    
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate; 
    if (startTime) filters.startTime = startTime;
    if (endTime) filters.endTime = endTime;
    if (limit) filters.limit = parseInt(limit);
    
    const data = await getStationRainData(filters);
    console.log(`✅ Station-Rain API: Found ${data.length} records`);
    
    res.json({ 
      success: true, 
      stationRainData: data, 
      count: data.length,
      filters: filters 
    });
  } catch (error) {
    console.error('❌ Station-Rain API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 2006;
app.listen(PORT, () => {
  console.log(`🚀 Test API Server running on http://localhost:${PORT}`);
  console.log('🔗 Available endpoints:');
  console.log(`   GET http://localhost:${PORT}/`);
  console.log(`   GET http://localhost:${PORT}/api/map`);
  console.log(`   GET http://localhost:${PORT}/api/station-data`);
  console.log(`   GET http://localhost:${PORT}/api/chart`);
  console.log(`   GET http://localhost:${PORT}/api/station-rain`);
});
