import {getStationData } from "../services/stationDataService.js";

const stationDataController = async (req, res, next) => {
  getStationData()
    .then((data) => res.status(200).json({ stationData: data }))
    .catch(next);
};

export default stationDataController;
