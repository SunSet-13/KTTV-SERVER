import { getAllProvinces, getStationsByProvince, getStationCountByProvince, getStationsGroupedByProvince, getStationsByProvinceName } from "../services/provinceService.js";

// Controller lấy tất cả tỉnh/thành phố
export const getAllProvincesController = async (req, res, next) => {
  console.log('getAllProvincesController called');
  
  const provinces = await getAllProvinces();
  
  res.status(200).json({ 
    success: true,
    data: provinces,
    count: provinces.length
  });
};

// Controller tìm kiếm trạm theo tỉnh
export const getStationsByProvinceController = async (req, res, next) => {
  console.log('getStationsByProvinceController called');
  console.log('Query params:', req.query);
  
  // Lấy các tham số từ query string
  const {
    provinceId,     // ID tỉnh
    provinceName,   // Tên tỉnh (tìm kiếm gần đúng)
    limit
  } = req.query;

  const filters = {};
  
  if (provinceId) filters.provinceId = provinceId;
  if (provinceName) filters.provinceName = provinceName;
  if (limit) filters.limit = parseInt(limit);

  const stations = await getStationsByProvince(filters);
  
  res.status(200).json({ 
    success: true,
    data: stations,
    count: stations.length,
    filters: filters
  });
};

// Controller thống kê trạm theo tỉnh
export const getStationCountController = async (req, res, next) => {
  console.log('getStationCountController called');
  
  const statistics = await getStationCountByProvince();
  
  res.status(200).json({ 
    success: true,
    data: statistics,
    count: statistics.length
  });
};

// Controller gom nhóm trạm theo tỉnh
export const getStationsGroupedController = async (req, res, next) => {
  console.log('getStationsGroupedController called');
  
  const groupedStations = await getStationsGroupedByProvince();
  
  res.status(200).json({ 
    success: true,
    data: groupedStations,
    count: groupedStations.length,
    totalStations: groupedStations.reduce((sum, province) => sum + province.StationCount, 0)
  });
};

// Controller lấy trạm theo tên tỉnh cụ thể
export const getStationsByProvinceNameController = async (req, res, next) => {
  console.log('getStationsByProvinceNameController called');
  console.log('Query params:', req.query);
  
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Province name is required. Use ?name=ProvinceName'
    });
  }
  
  const stations = await getStationsByProvinceName(name);
  
  res.status(200).json({ 
    success: true,
    provinceName: name,
    data: stations,
    count: stations.length
  });
};

export default {
  getAllProvincesController,
  getStationsByProvinceController,
  getStationCountController
};
