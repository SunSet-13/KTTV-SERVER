import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { BoardRoute } from './boardRouter.js'
import mapController from "../controllers/mapController.js";
import chartController from "../controllers/chartController.js";
import stationDataController from '../controllers/stationDataController.js';
import stationRainController from '../controllers/stationRainController.js';

const Router = express.Router()

// Check API status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 is running...', code: StatusCodes.OK })
})
//Board Api
Router.use('/boards', BoardRoute)
export const APIs_V1 = Router

export const routes = (app) => {
  app.get("/api/map", mapController);
  app.get("/api/chart", chartController);
  app.get("/api/station-data", stationDataController);
  app.get("/api/station-rain", stationRainController);
};
