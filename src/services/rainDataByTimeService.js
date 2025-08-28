import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Lấy dữ liệu mưa theo thời gian cụ thể
export async function getRainDataByTime(filters = {}) {
  console.log('Getting rain data by specific time with filters:', filters);
  
  const { 
    year,
    month, 
    day,
    hour,
    limit = 1000 
  } = filters;

  // Kiểm tra các tham số bắt buộc
  if (!year || !month || !day) {
    throw new Error('Year, month, and day are required');
  }

  // Xây dựng điều kiện WHERE đơn giản và chính xác
  let whereClause = `
    WHERE r.Value IS NOT NULL
      AND s.Latitude IS NOT NULL
      AND s.Longitude IS NOT NULL
      AND r.Year = ${parseInt(year)}
      AND r.Month = ${parseInt(month)}
      AND r.Day = ${parseInt(day)}
  `;

  // Thêm điều kiện giờ nếu có
  if (hour !== undefined && hour !== null && hour !== '') {
    whereClause += ` AND r.Hour = ${parseInt(hour)}`;
  }

  // Query tối ưu join Rain1h với Station
  const query = `
    SELECT TOP ${limit}
      s.StationName,
      s.StationNameVN,
      s.Latitude,
      s.Longitude,
      r.Value,
      r.Year,
      r.Month,
      r.Day,
      r.Hour,
      CONCAT(r.Year, '-', 
             FORMAT(r.Month, '00'), '-', 
             FORMAT(r.Day, '00'), ' ', 
             FORMAT(r.Hour, '00'), ':00:00') as DateTime
    FROM Rain1h r
    INNER JOIN Station s ON r.StationID = s.StationID
    ${whereClause}
    ORDER BY r.Hour ASC, s.StationName ASC
  `;

  console.log('Executing query:', query);

  const result = await prisma.$queryRawUnsafe(query);

  console.log('Query executed, found', result.length, 'records');

  // Convert BigInt to Number cho các trường số
  const convertedResult = result.map(row => ({
    StationName: row.StationName,
    StationNameVN: row.StationNameVN,
    Latitude: typeof row.Latitude === 'bigint' ? Number(row.Latitude) : row.Latitude,
    Longitude: typeof row.Longitude === 'bigint' ? Number(row.Longitude) : row.Longitude,
    Value: typeof row.Value === 'bigint' ? Number(row.Value) : row.Value,
    Year: typeof row.Year === 'bigint' ? Number(row.Year) : row.Year,
    Month: typeof row.Month === 'bigint' ? Number(row.Month) : row.Month,
    Day: typeof row.Day === 'bigint' ? Number(row.Day) : row.Day,
    Hour: typeof row.Hour === 'bigint' ? Number(row.Hour) : row.Hour,
    DateTime: row.DateTime
  }));

  console.log('Data conversion completed');
  return convertedResult;
}

// Lấy dữ liệu mưa theo khoảng thời gian
export async function getRainDataByTimeRange(filters = {}) {
  console.log('Getting rain data by time range with filters:', filters);
  
  const { 
    startYear,
    startMonth, 
    startDay,
    startHour = 0,
    endYear,
    endMonth,
    endDay,
    endHour = 23,
    limit = 1000 
  } = filters;

  // Kiểm tra các tham số bắt buộc
  if (!startYear || !startMonth || !startDay) {
    throw new Error('Start year, month, and day are required');
  }

  // Nếu không có end date, sử dụng start date
  const finalEndYear = endYear || startYear;
  const finalEndMonth = endMonth || startMonth;
  const finalEndDay = endDay || startDay;

  // Tạo datetime strings để so sánh dễ dàng hơn
  const startDateTime = `${startYear}-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')} ${startHour.toString().padStart(2, '0')}:00:00`;
  const endDateTime = `${finalEndYear}-${finalEndMonth.toString().padStart(2, '0')}-${finalEndDay.toString().padStart(2, '0')} ${endHour.toString().padStart(2, '0')}:00:00`;

  // Query đơn giản hơn sử dụng datetime comparison
  const query = `
    SELECT TOP ${limit}
      s.StationName,
      s.StationNameVN,
      s.Latitude,
      s.Longitude,
      r.Value,
      r.Year,
      r.Month,
      r.Day,
      r.Hour,
      CONCAT(r.Year, '-', 
             FORMAT(r.Month, '00'), '-', 
             FORMAT(r.Day, '00'), ' ', 
             FORMAT(r.Hour, '00'), ':00:00') as DateTime
    FROM Rain1h r
    INNER JOIN Station s ON r.StationID = s.StationID
    WHERE r.Value IS NOT NULL
      AND s.Latitude IS NOT NULL
      AND s.Longitude IS NOT NULL
      AND CONCAT(r.Year, '-', 
                 FORMAT(r.Month, '00'), '-', 
                 FORMAT(r.Day, '00'), ' ', 
                 FORMAT(r.Hour, '00'), ':00:00') >= '${startDateTime}'
      AND CONCAT(r.Year, '-', 
                 FORMAT(r.Month, '00'), '-', 
                 FORMAT(r.Day, '00'), ' ', 
                 FORMAT(r.Hour, '00'), ':00:00') <= '${endDateTime}'
    ORDER BY r.Year ASC, r.Month ASC, r.Day ASC, r.Hour ASC, s.StationName ASC
  `;

  console.log('Executing range query:', query);

  const result = await prisma.$queryRawUnsafe(query);

  console.log('Range query executed, found', result.length, 'records');

  // Convert BigInt to Number
  const convertedResult = result.map(row => ({
    StationName: row.StationName,
    StationNameVN: row.StationNameVN,
    Latitude: typeof row.Latitude === 'bigint' ? Number(row.Latitude) : row.Latitude,
    Longitude: typeof row.Longitude === 'bigint' ? Number(row.Longitude) : row.Longitude,
    Value: typeof row.Value === 'bigint' ? Number(row.Value) : row.Value,
    Year: typeof row.Year === 'bigint' ? Number(row.Year) : row.Year,
    Month: typeof row.Month === 'bigint' ? Number(row.Month) : row.Month,
    Day: typeof row.Day === 'bigint' ? Number(row.Day) : row.Day,
    Hour: typeof row.Hour === 'bigint' ? Number(row.Hour) : row.Hour,
    DateTime: row.DateTime
  }));

  console.log('Range data conversion completed');
  return convertedResult;
}
