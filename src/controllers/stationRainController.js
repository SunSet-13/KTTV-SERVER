import { getStationRainData } from "../services/stationRainService.js";

const stationRainController = async (req, res, next) => {
  try {
    console.log('stationRainController called');
    console.log('Query params:', req.query);
    
    // Lấy các tham số từ query string
    const {
      startDate,    // Format: YYYY-MM-DD
      endDate,      // Format: YYYY-MM-DD  
      startTime,    // Format: HH (0-23)
      endTime,      // Format: HH (0-23)
      limit
    } = req.query;

    const filters = {};
    
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (startTime) filters.startTime = startTime;
    if (endTime) filters.endTime = endTime;
    if (limit) filters.limit = parseInt(limit);

    const data = await getStationRainData(filters);
    
    res.status(200).json({ 
      success: true,
      stationRainData: data,
      count: data.length,
      filters: filters
    });
  } catch (error) {
    console.error('Controller error:', error);
    next(error);
  }
};

export default stationRainController;
