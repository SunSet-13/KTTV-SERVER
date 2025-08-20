import {getStationData } from "../services/stationDataRain1h.js";

const stationDataRain1hController = async (req, res, next) => {
  getStationData()
    .then((data) => res.status(200).json({ stationDataRain1h: data }))
    .catch(next);
};

export default stationDataRain1hController;
