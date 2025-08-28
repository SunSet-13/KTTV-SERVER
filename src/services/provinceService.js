import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Lấy tất cả các tỉnh/thành phố
export async function getAllProvinces() {
  console.log('Getting all provinces...');
  
  const result = await prisma.$queryRaw`
    SELECT 
      ProvinceID,
      ProvinceName
    FROM Province
    ORDER BY ProvinceName
  `;

  console.log('Found provinces:', result.length);

  // Convert BigInt to Number
  return result.map(row => {
    const convertedRow = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'bigint') {
        convertedRow[key] = Number(value);
      } else {
        convertedRow[key] = value;
      }
    }
    return convertedRow;
  });
}

// Tìm kiếm trạm theo ProvinceID hoặc ProvinceName
export async function getStationsByProvince(filters = {}) {
  console.log('Getting stations by province with filters:', filters);
  
  const { 
    provinceId, 
    provinceName,
    limit = 1000 
  } = filters;

  // Xây dựng điều kiện WHERE động
  let whereClause = `
    WHERE s.Latitude IS NOT NULL
      AND s.Longitude IS NOT NULL
  `;

  // Thêm điều kiện lọc theo ProvinceID
  if (provinceId) {
    whereClause += ` AND s.ProvinceID = ${parseInt(provinceId)}`;
  }
  
  // Thêm điều kiện lọc theo ProvinceName
  if (provinceName) {
    whereClause += ` AND p.ProvinceName LIKE N'%${provinceName}%'`;
  }

  // Query join Station với Province
  const query = `
    SELECT TOP ${limit}
      s.StationID,
      s.StationNo,
      s.StationName,
      s.StationNameVN,
      s.Latitude,
      s.Longitude,
      s.Elevation,
      s.Address,
      s.Status,
      s.ProvinceID,
      p.ProvinceName
    FROM Station s
    LEFT JOIN Province p ON s.ProvinceID = p.ProvinceID
    ${whereClause}
    ORDER BY p.ProvinceName, s.StationName
  `;

  console.log('Executing query:', query);

  const result = await prisma.$queryRawUnsafe(query);

  console.log('Query executed, found', result.length, 'stations');

  // Convert BigInt to Number
  const convertedResult = result.map(row => {
    const convertedRow = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'bigint') {
        convertedRow[key] = Number(value);
      } else {
        convertedRow[key] = value;
      }
    }
    return convertedRow;
  });

  console.log('Data conversion completed');
  return convertedResult;
}

// Lấy các trạm theo tên tỉnh (tìm kiếm chính xác) kèm dữ liệu lượng mưa
export async function getStationsByProvinceName(provinceName) {
  console.log('Getting stations with rain data by province name:', provinceName);
  
  const result = await prisma.$queryRaw`
    SELECT 
      s.StationID,
      s.StationNo,
      s.StationName,
      s.StationNameVN,
      s.Latitude,
      s.Longitude,
      s.Elevation,
      s.Address,
      s.Status,
      s.ProvinceID,
      p.ProvinceName,
      r.Value as LatestRainValue,
      r.DtDate as LatestRainDate,
      r.Year as LatestRainYear,
      r.Month as LatestRainMonth,
      r.Day as LatestRainDay,
      r.Hour as LatestRainHour,
      CONCAT(r.Year, '-', 
             FORMAT(r.Month, '00'), '-', 
             FORMAT(r.Day, '00'), ' ', 
             FORMAT(r.Hour, '00'), ':00:00') as LatestRainDateTime
    FROM Station s
    INNER JOIN Province p ON s.ProvinceID = p.ProvinceID
    LEFT JOIN (
      SELECT 
        r1.StationID,
        r1.StationNo,
        r1.Value,
        r1.DtDate,
        r1.Year,
        r1.Month,
        r1.Day,
        r1.Hour,
        ROW_NUMBER() OVER (
          PARTITION BY r1.StationID 
          ORDER BY r1.DtDate DESC, r1.Hour DESC
        ) as rn
      FROM Rain1h r1
      WHERE r1.Value IS NOT NULL
    ) r ON (s.StationID = r.StationID OR s.StationNo = r.StationNo) AND r.rn = 1
    WHERE p.ProvinceName = ${provinceName}
      AND s.Latitude IS NOT NULL
      AND s.Longitude IS NOT NULL
    ORDER BY s.StationName
  `;

  console.log('Found stations with rain data:', result.length);

  // Convert BigInt to Number
  return result.map(row => {
    const convertedRow = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'bigint') {
        convertedRow[key] = Number(value);
      } else {
        convertedRow[key] = value;
      }
    }
    return convertedRow;
  });
}

// Gom nhóm tất cả trạm theo từng tỉnh
export async function getStationsGroupedByProvince() {
  console.log('Getting stations grouped by province...');
  
  const result = await prisma.$queryRaw`
    SELECT 
      p.ProvinceID,
      p.ProvinceName,
      s.StationID,
      s.StationNo,
      s.StationName,
      s.StationNameVN,
      s.Latitude,
      s.Longitude,
      s.Elevation,
      s.Address,
      s.Status
    FROM Province p
    LEFT JOIN Station s ON p.ProvinceID = s.ProvinceID
    WHERE s.StationID IS NOT NULL
      AND s.Latitude IS NOT NULL
      AND s.Longitude IS NOT NULL
    ORDER BY p.ProvinceName, s.StationName
  `;

  console.log('Found stations:', result.length);

  // Convert BigInt to Number
  const convertedResult = result.map(row => {
    const convertedRow = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'bigint') {
        convertedRow[key] = Number(value);
      } else {
        convertedRow[key] = value;
      }
    }
    return convertedRow;
  });

  // Group stations by province
  const groupedStations = convertedResult.reduce((acc, station) => {
    const provinceKey = station.ProvinceID;
    
    if (!acc[provinceKey]) {
      acc[provinceKey] = {
        ProvinceID: station.ProvinceID,
        ProvinceName: station.ProvinceName,
        StationCount: 0,
        Stations: []
      };
    }
    
    acc[provinceKey].Stations.push({
      StationID: station.StationID,
      StationNo: station.StationNo,
      StationName: station.StationName,
      StationNameVN: station.StationNameVN,
      Latitude: station.Latitude,
      Longitude: station.Longitude,
      Elevation: station.Elevation,
      Address: station.Address,
      Status: station.Status
    });
    
    acc[provinceKey].StationCount = acc[provinceKey].Stations.length;
    
    return acc;
  }, {});

  // Convert object to array and sort by province name
  const result_array = Object.values(groupedStations).sort((a, b) => 
    a.ProvinceName.localeCompare(b.ProvinceName)
  );

  console.log('Grouped into', result_array.length, 'provinces');
  return result_array;
}

// Thống kê số lượng trạm theo từng tỉnh
export async function getStationCountByProvince() {
  console.log('Getting station count by province...');
  
  const result = await prisma.$queryRaw`
    SELECT 
      p.ProvinceID,
      p.ProvinceName,
      COUNT(s.StationID) as StationCount,
      COUNT(CASE WHEN s.Status = 1 THEN 1 END) as ActiveStations,
      COUNT(CASE WHEN s.Status = 0 THEN 1 END) as InactiveStations
    FROM Province p
    LEFT JOIN Station s ON p.ProvinceID = s.ProvinceID
    GROUP BY p.ProvinceID, p.ProvinceName
    ORDER BY StationCount DESC, p.ProvinceName
  `;

  console.log('Found province statistics:', result.length);

  // Convert BigInt to Number
  return result.map(row => {
    const convertedRow = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'bigint') {
        convertedRow[key] = Number(value);
      } else {
        convertedRow[key] = value;
      }
    }
    return convertedRow;
  });
}
