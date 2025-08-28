import express from 'express';
import { 
  getAllProvincesController, 
  getStationsByProvinceController,
  getStationCountController,
  getStationsGroupedController,
  getStationsByProvinceNameController
} from '../controllers/provinceController.js';

const router = express.Router();

// GET /api/provinces - Lấy tất cả tỉnh/thành phố
router.get('/', getAllProvincesController);

// GET /api/provinces/stations - Tìm kiếm trạm theo tỉnh
router.get('/stations', getStationsByProvinceController);

// GET /api/provinces/statistics - Thống kê trạm theo tỉnh
router.get('/statistics', getStationCountController);

// GET /api/provinces/grouped - Lấy trạm theo nhóm tỉnh
router.get('/grouped', getStationsGroupedController);

// GET /api/provinces/by-name - Lấy trạm theo tên tỉnh cụ thể (query parameter)
router.get('/by-name', getStationsByProvinceNameController);

export default router;
