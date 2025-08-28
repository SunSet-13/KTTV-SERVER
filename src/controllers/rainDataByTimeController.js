import { getRainDataByTime, getRainDataByTimeRange } from "../services/rainDataByTimeService.js";

// Controller lấy dữ liệu mưa theo thời gian cụ thể
export const getRainDataByTimeController = async (req, res, next) => {
  console.log('getRainDataByTimeController called');
  console.log('Query params:', req.query);
  
  const {
    year,        // Năm (bắt buộc)
    month,       // Tháng (bắt buộc) 
    day,         // Ngày (bắt buộc)
    hour,        // Giờ (tùy chọn)
    limit = 100
  } = req.query;

  // Kiểm tra tham số bắt buộc
  if (!year || !month || !day) {
    return res.status(400).json({
      success: false,
      error: 'Year, month, and day are required',
      example: 'GET /api/rain-time?year=2025&month=8&day=12&hour=23'
    });
  }

  const filters = { year, month, day, limit };
  
  if (hour !== undefined && hour !== '') {
    filters.hour = hour;
  }

  try {
    const data = await getRainDataByTime(filters);
    
    const queryTime = hour !== undefined ? 
      `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:00:00` :
      `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} (Tất cả các giờ)`;
    
    res.status(200).json({ 
      success: true,
      message: 'Dữ liệu lượng mưa theo thời gian',
      queryTime: queryTime,
      totalRecords: data.length,
      data: data
    });
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Controller lấy dữ liệu mưa theo khoảng thời gian
export const getRainDataByTimeRangeController = async (req, res, next) => {
  console.log('getRainDataByTimeRangeController called');
  console.log('Query params:', req.query);
  
  const {
    startYear,   // Năm bắt đầu (bắt buộc)
    startMonth,  // Tháng bắt đầu (bắt buộc)
    startDay,    // Ngày bắt đầu (bắt buộc)
    startHour = 0,   // Giờ bắt đầu (mặc định 0)
    endYear,     // Năm kết thúc (tùy chọn)
    endMonth,    // Tháng kết thúc (tùy chọn)
    endDay,      // Ngày kết thúc (tùy chọn)
    endHour = 23,    // Giờ kết thúc (mặc định 23)
    limit = 100
  } = req.query;

  // Kiểm tra tham số bắt buộc
  if (!startYear || !startMonth || !startDay) {
    return res.status(400).json({
      success: false,
      error: 'Start year, month, and day are required',
      example: 'GET /api/rain-time/range?startYear=2025&startMonth=8&startDay=12&endDay=13'
    });
  }

  const filters = { 
    startYear, startMonth, startDay, startHour,
    endYear, endMonth, endDay, endHour, limit
  };

  try {
    const data = await getRainDataByTimeRange(filters);
    
    const startDateTime = `${startYear}-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')} ${startHour.toString().padStart(2, '0')}:00:00`;
    const endDateTime = `${endYear || startYear}-${(endMonth || startMonth).toString().padStart(2, '0')}-${(endDay || startDay).toString().padStart(2, '0')} ${endHour.toString().padStart(2, '0')}:00:00`;
    
    res.status(200).json({ 
      success: true,
      message: 'Dữ liệu lượng mưa theo khoảng thời gian',
      timeRange: `${startDateTime} đến ${endDateTime}`,
      totalRecords: data.length,
      data: data
    });
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export default {
  getRainDataByTimeController,
  getRainDataByTimeRangeController
};
