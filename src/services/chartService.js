import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Lấy dữ liệu lượng mưa từng giờ cho biểu đồ
export async function getHourlyRainChartData(filters = {}) {
  console.log('Getting hourly rain chart data with filters:', filters);
  
  const { 
    stationIds,    // Mảng các StationID
    startDate,     // Ngày bắt đầu (YYYY-MM-DD)
    endDate,       // Ngày kết thúc (YYYY-MM-DD)
    startTime,     // Giờ bắt đầu (HH)
    endTime,       // Giờ kết thúc (HH)
    limit = 2000   // Giới hạn số record
  } = filters;

  // Xây dựng điều kiện WHERE động
  let whereClause = `
    WHERE r.Value IS NOT NULL 
      AND r.StationID IS NOT NULL
      AND s.StationID IS NOT NULL
      AND s.Latitude IS NOT NULL
      AND s.Longitude IS NOT NULL
  `;

  // Thêm filter theo StationID
  if (stationIds && stationIds.length > 0) {
    const stationIdsList = stationIds.map(id => parseInt(id)).join(',');
    whereClause += ` AND r.StationID IN (${stationIdsList})`;
  }

  // Thêm filter theo ngày
  if (startDate) {
    whereClause += ` AND r.DtDate >= '${startDate}'`;
  }
  
  if (endDate) {
    whereClause += ` AND r.DtDate <= '${endDate}'`;
  }

  // Thêm filter theo giờ
  if (startTime !== undefined) {
    whereClause += ` AND r.Hour >= ${parseInt(startTime)}`;
  }
  
  if (endTime !== undefined) {
    whereClause += ` AND r.Hour <= ${parseInt(endTime)}`;
  }

  // Query lấy dữ liệu với thông tin trạm
  const query = `
    SELECT TOP ${limit}
      r.StationID,
      s.StationNo,
      s.StationName,
      s.StationNameVN,
      s.Latitude,
      s.Longitude,
      r.Value as RainValue,
      r.DtDate,
      r.Year,
      r.Month,
      r.Day,
      r.Hour,
      CONCAT(r.Year, '-', 
             FORMAT(r.Month, '00'), '-', 
             FORMAT(r.Day, '00'), ' ', 
             FORMAT(r.Hour, '00'), ':00:00') as DateTime
    FROM Rain1h r
    INNER JOIN Station s ON (r.StationID = s.StationID OR r.StationNo = s.StationNo)
    ${whereClause}
    ORDER BY r.DtDate DESC, r.Hour DESC, r.StationID
  `;

  console.log('Executing query:', query);

  const result = await prisma.$queryRawUnsafe(query);

  console.log('Query executed, found', result.length, 'records');

  // Convert BigInt to Number và format data
  const chartData = result.map(row => {
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

  // Group data theo trạm để tạo series cho chart
  const groupedByStation = chartData.reduce((acc, record) => {
    const stationKey = record.StationID;
    
    if (!acc[stationKey]) {
      acc[stationKey] = {
        StationID: record.StationID,
        StationNo: record.StationNo,
        StationName: record.StationName,
        StationNameVN: record.StationNameVN,
        Latitude: record.Latitude,
        Longitude: record.Longitude,
        Data: []
      };
    }
    
    acc[stationKey].Data.push({
      DateTime: record.DateTime,
      DtDate: record.DtDate,
      Year: record.Year,
      Month: record.Month,
      Day: record.Day,
      Hour: record.Hour,
      RainValue: record.RainValue
    });
    
    return acc;
  }, {});

  // Convert object to array và sort data trong mỗi station
  const stations = Object.values(groupedByStation).map(station => ({
    ...station,
    Data: station.Data.sort((a, b) => {
      if (a.DtDate !== b.DtDate) {
        return new Date(a.DtDate) - new Date(b.DtDate);
      }
      return a.Hour - b.Hour;
    }),
    TotalRecords: station.Data.length,
    MaxRainValue: Math.max(...station.Data.map(d => d.RainValue)),
    MinRainValue: Math.min(...station.Data.map(d => d.RainValue)),
    AvgRainValue: station.Data.reduce((sum, d) => sum + d.RainValue, 0) / station.Data.length
  }));

  console.log('Data processing completed, grouped into', stations.length, 'stations');
  
  return {
    stations: stations,
    summary: {
      totalStations: stations.length,
      totalRecords: chartData.length,
      dateRange: {
        from: startDate || 'All',
        to: endDate || 'All'
      },
      timeRange: {
        from: startTime !== undefined ? `${startTime}:00` : 'All',
        to: endTime !== undefined ? `${endTime}:00` : 'All'
      }
    }
  };
}

// Lấy dữ liệu tổng hợp lượng mưa theo ngày cho biểu đồ
export async function getDailyRainChartData(filters = {}) {
  console.log('Getting daily rain chart data with filters:', filters);
  
  const { 
    stationIds,
    startDate,
    endDate,
    limit = 1000
  } = filters;

  let whereClause = `
    WHERE r.Value IS NOT NULL 
      AND r.StationID IS NOT NULL
      AND s.StationID IS NOT NULL
  `;

  if (stationIds && stationIds.length > 0) {
    const stationIdsList = stationIds.map(id => parseInt(id)).join(',');
    whereClause += ` AND r.StationID IN (${stationIdsList})`;
  }

  if (startDate) {
    whereClause += ` AND r.DtDate >= '${startDate}'`;
  }
  
  if (endDate) {
    whereClause += ` AND r.DtDate <= '${endDate}'`;
  }

  // Query tổng hợp theo ngày
  const query = `
    SELECT TOP ${limit}
      r.StationID,
      s.StationNo,
      s.StationName,
      s.StationNameVN,
      s.Latitude,
      s.Longitude,
      r.DtDate,
      r.Year,
      r.Month,
      r.Day,
      SUM(r.Value) as DailyTotal,
      AVG(r.Value) as DailyAverage,
      MAX(r.Value) as DailyMax,
      MIN(r.Value) as DailyMin,
      COUNT(r.Value) as HourlyRecords
    FROM Rain1h r
    INNER JOIN Station s ON (r.StationID = s.StationID OR r.StationNo = s.StationNo)
    ${whereClause}
    GROUP BY r.StationID, s.StationNo, s.StationName, s.StationNameVN, 
             s.Latitude, s.Longitude, r.DtDate, r.Year, r.Month, r.Day
    ORDER BY r.DtDate DESC, r.StationID
  `;

  console.log('Executing daily aggregation query:', query);

  const result = await prisma.$queryRawUnsafe(query);

  // Convert BigInt to Number
  const dailyData = result.map(row => {
    const convertedRow = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'bigint') {
        convertedRow[key] = Number(value);
      } else if (typeof value === 'number' && !Number.isInteger(value)) {
        convertedRow[key] = Math.round(value * 100) / 100; // Round to 2 decimal places
      } else {
        convertedRow[key] = value;
      }
    }
    return convertedRow;
  });

  console.log('Daily aggregation completed, found', dailyData.length, 'daily records');
  
  return {
    dailyData: dailyData,
    summary: {
      totalRecords: dailyData.length,
      dateRange: {
        from: startDate || 'All',
        to: endDate || 'All'
      }
    }
  };
}