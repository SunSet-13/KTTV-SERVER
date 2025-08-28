import express from 'express';
import { 
  getRainDataByTimeController,
  getRainDataByTimeRangeController
} from '../controllers/rainDataByTimeController.js';

const router = express.Router();

//  /api/rain-time - Lấy dữ liệu mưa theo thời gian cụ thể
router.get('/', getRainDataByTimeController);

//  /api/rain-time/range - Lấy dữ liệu mưa theo khoảng thời gian
router.get('/range', getRainDataByTimeRangeController);

export default router;
