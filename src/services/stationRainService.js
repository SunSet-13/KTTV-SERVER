import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getStationRainData(filters = {}) {
  try {
    console.log('Starting getStationRainData with filters:', filters);
    
    const { 
      startDate, 
      endDate, 
      startTime, 
      endTime,
      limit = 5000 
    } = filters;

    // Xây dựng điều kiện WHERE động
    let whereClause = `
      WHERE r.Value IS NOT NULL
        AND s.Latitude IS NOT NULL
        AND s.Longitude IS NOT NULL
    `;

    // Thêm điều kiện lọc theo ngày
    if (startDate) {
      whereClause += ` AND r.DtDate >= '${startDate}'`;
    }
    
    if (endDate) {
      whereClause += ` AND r.DtDate <= '${endDate}'`;
    }

    // Thêm điều kiện lọc theo giờ
    if (startTime) {
      whereClause += ` AND r.Hour >= ${parseInt(startTime)}`;
    }
    
    if (endTime) {
      whereClause += ` AND r.Hour <= ${parseInt(endTime)}`;
    }

    // Sử dụng raw query để join 2 bảng Station và Rain1h dựa vào StationNo
    const query = `
      SELECT TOP ${limit}
        s.StationID,
        s.StationNo,
        s.StationName,
        s.Latitude,
        s.Longitude,
        s.Address,
        r.ID as RainID,
        r.DtDate,
        r.Year,
        r.Month,
        r.Day,
        r.Hour,
        r.Value as RainValue
      FROM Station s
      INNER JOIN Rain1h r ON s.StationNo = r.StationNo
      ${whereClause}
      ORDER BY r.DtDate DESC, r.Hour DESC
    `;

    console.log('Executing query:', query);

    const result = await prisma.$queryRawUnsafe(query);

    console.log('Query executed, found', result.length, 'records');

    // Convert BigInt thành Number để có thể serialize thành JSON
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
    
  } catch (error) {
    console.error('Error in getStationRainData:', error);
    throw new Error('Failed to fetch station rain data: ' + error.message);
  }
}
