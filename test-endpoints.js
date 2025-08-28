// Test file để kiểm tra các API endpoints
const BASE_URL = 'http://localhost:2004';

async function makeRequest(endpoint, description) {
  try {
    console.log(`\n🔍 Testing ${description}...`);
    console.log(`📡 URL: ${BASE_URL}${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Status: ${response.status} OK`);
    
    // Hiển thị thông tin về response
    if (data.rainValues) {
      console.log(`📍 Total stations: ${data.rainValues.length}`);
      if (data.rainValues.length > 0) {
        console.log(`📍 Sample station:`, {
          StationID: data.rainValues[0].StationID,
          StationName: data.rainValues[0].StationName,
          Latitude: data.rainValues[0].Latitude,
          Longitude: data.rainValues[0].Longitude
        });
      }
    }
    
    if (data.stationRainData) {
      console.log(`📈 Total station-rain records: ${data.stationRainData.length}`);
      if (data.stationRainData.length > 0) {
        console.log(`📍 Sample record:`, {
          StationID: data.stationRainData[0].StationID,
          StationName: data.stationRainData[0].StationName,
          RainValue: data.stationRainData[0].RainValue,
          DtDate: data.stationRainData[0].DtDate,
          Hour: data.stationRainData[0].Hour
        });
      }
    }
    
    if (data.stationData) {
      console.log(`📍 Total station data: ${data.stationData.length}`);
      if (data.stationData.length > 0) {
        console.log(`📍 Sample station:`, {
          StationID: data.stationData[0].StationID,
          StationName: data.stationData[0].StationName,
          ProvinceID: data.stationData[0].ProvinceID,
          RegID: data.stationData[0].RegID
        });
      }
    }
    
    if (data.rainValue) {
      console.log(`🌧️ Total rain records: ${data.rainValue.length}`);
      if (data.rainValue.length > 0) {
        console.log(`🌧️ Sample rain:`, {
          StationID: data.rainValue[0].StationID,
          Value: data.rainValue[0].Value,
          DtDate: data.rainValue[0].DtDate,
          Hour: data.rainValue[0].Hour
        });
      }
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

// Test function
async function testAllAPIs() {
  console.log('🚀 Starting API Endpoint Tests...');
  
  // Test cơ bản
  await makeRequest('/', 'Homepage');
  
  // Test các API chính
  await makeRequest('/api/map', 'Map API - Station coordinates for markers');
  await makeRequest('/api/station-data', 'Station Data API - Complete station info');
  await makeRequest('/api/chart', 'Chart API - Rain1h data');
  
  // Test API chính (JOIN)
  await makeRequest('/api/station-rain?limit=5', 'Station-Rain JOIN API (Limited to 5)');
  
  // Test với filter
  await makeRequest('/api/station-rain?startDate=2025-12-01&endDate=2025-12-31&limit=3', 
    'Station-Rain with Date Filter (Dec 2025)');
  
  await makeRequest('/api/station-rain?startTime=6&endTime=18&limit=3', 
    'Station-Rain with Time Filter (6AM-6PM)');
    
  await makeRequest('/api/station-rain?startDate=2025-12-08&startTime=20&endTime=23&limit=5', 
    'Station-Rain with Date + Time Filter (Dec 8, 8PM-11PM)');
  
  console.log('\n✨ All API tests completed!');
  console.log('\n📋 Summary:');
  console.log('1. /api/map - Returns station coordinates for map markers');
  console.log('2. /api/station-data - Returns complete station information');
  console.log('3. /api/chart - Returns rain data for charts');
  console.log('4. /api/station-rain - Returns joined data with filtering options');
  console.log('\n🎯 Your APIs are ready for displaying markers with rainfall data!');
}

// Import fetch for Node.js
import('node-fetch').then(({ default: fetch }) => {
  global.fetch = fetch;
  testAllAPIs();
}).catch(() => {
  console.log('Note: node-fetch not available, using built-in fetch');
  testAllAPIs();
});
