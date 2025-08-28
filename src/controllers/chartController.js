import { getHourlyRainChartData, getDailyRainChartData } from "../services/chartService.js";

// Controller cho biểu đồ lượng mưa từng giờ
const chartController = async (req, res, next) => {
  console.log('chartController called');
  console.log('Query params:', req.query);
  
  // Lấy các tham số từ query string
  const {
    stationIds,    // Comma-separated list: "1001,1002,1003"
    startDate,     // YYYY-MM-DD
    endDate,       // YYYY-MM-DD
    startTime,     // HH (0-23)
    endTime,       // HH (0-23)
    limit,
    type = 'hourly' // 'hourly' hoặc 'daily'
  } = req.query;

  // Parse stationIds thành array
  const filters = {};
  
  if (stationIds) {
    filters.stationIds = stationIds.split(',').map(id => id.trim());
  }
  
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (startTime !== undefined) filters.startTime = startTime;
  if (endTime !== undefined) filters.endTime = endTime;
  if (limit) filters.limit = parseInt(limit);

  // Chọn service function dựa trên type
  const serviceFunction = type === 'daily' ? getDailyRainChartData : getHourlyRainChartData;
  
  const data = await serviceFunction(filters);
  
  res.status(200).json({ 
    success: true,
    type: type,
    data: data,
    filters: filters
  });
};

export default chartController;
