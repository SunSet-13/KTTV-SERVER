import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testAPIs() {
  try {
    console.log('🚀 Testing Database Connections and Queries...\n');
    
    // Test 1: Check Station table
    console.log('📍 Testing Station table...');
    const stations = await prisma.station.findMany({
      take: 3,
      select: {
        StationID: true,
        StationNo: true,
        StationName: true,
        Latitude: true,
        Longitude: true,
      }
    });
    console.log('✅ Station data sample:');
    console.table(stations);
    
    // Test 2: Check Rain1h table
    console.log('\n🌧️ Testing Rain1h table...');
    const rain1h = await prisma.rain1h.findMany({
      take: 3,
      select: {
        ID: true,
        StationID: true,
        DtDate: true,
        Hour: true,
        Value: true,
      },
      where: {
        Value: { not: null }
      },
      orderBy: { DtDate: 'desc' }
    });
    console.log('✅ Rain1h data sample:');
    console.table(rain1h);
    
    // Test 3: Test the JOIN query directly
    console.log('\n🔗 Testing JOIN query (Station + Rain1h)...');
    const joinQuery = `
      SELECT TOP 3
        s.StationID,
        s.StationNo,
        s.StationName,
        s.Latitude,
        s.Longitude,
        r.ID as RainID,
        r.DtDate,
        r.Hour,
        r.Value as RainValue
      FROM Station s
      INNER JOIN Rain1h r ON (s.StationNo = r.StationNo OR s.StationID = r.StationID)
      WHERE r.Value IS NOT NULL
        AND s.Latitude IS NOT NULL
        AND s.Longitude IS NOT NULL
      ORDER BY r.DtDate DESC, r.Hour DESC
    `;
    
    const joinResult = await prisma.$queryRawUnsafe(joinQuery);
    console.log('✅ JOIN query result:');
    console.table(joinResult.map(row => ({
      StationID: Number(row.StationID),
      StationNo: row.StationNo,
      StationName: row.StationName,
      Latitude: Number(row.Latitude),
      Longitude: Number(row.Longitude),
      RainID: Number(row.RainID),
      DtDate: row.DtDate,
      Hour: Number(row.Hour),
      RainValue: Number(row.RainValue)
    })));
    
    // Test 4: Check Station coverage
    console.log('\n📊 Checking Station data coverage...');
    const stationStats = await prisma.$queryRawUnsafe(`
      SELECT 
        COUNT(*) as TotalStations,
        COUNT(Latitude) as StationsWithLatitude,
        COUNT(Longitude) as StationsWithLongitude,
        COUNT(CASE WHEN Latitude IS NOT NULL AND Longitude IS NOT NULL THEN 1 END) as ValidCoordinates
      FROM Station
    `);
    console.log('✅ Station statistics:');
    console.table(stationStats.map(s => ({
      TotalStations: Number(s.TotalStations),
      StationsWithLatitude: Number(s.StationsWithLatitude),
      StationsWithLongitude: Number(s.StationsWithLongitude),
      ValidCoordinates: Number(s.ValidCoordinates)
    })));
    
    // Test 5: Check Rain1h coverage
    console.log('\n🌧️ Checking Rain1h data coverage...');
    const rainStats = await prisma.$queryRawUnsafe(`
      SELECT 
        COUNT(*) as TotalRecords,
        COUNT(Value) as RecordsWithValue,
        COUNT(DISTINCT StationID) as UniqueStations,
        MIN(DtDate) as EarliestDate,
        MAX(DtDate) as LatestDate
      FROM Rain1h
      WHERE Value IS NOT NULL
    `);
    console.log('✅ Rain1h statistics:');
    console.table(rainStats.map(r => ({
      TotalRecords: Number(r.TotalRecords),
      RecordsWithValue: Number(r.RecordsWithValue),
      UniqueStations: Number(r.UniqueStations),
      EarliestDate: r.EarliestDate,
      LatestDate: r.LatestDate
    })));
    
    console.log('\n✨ Database testing completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPIs();
