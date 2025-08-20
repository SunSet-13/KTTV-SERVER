import { getRainData } from "../services/mapService.js";

const mapController = async (req, res, next) => {
  getRainData()
    .then((data) => res.status(200).json({ rainValues: data }))
    .catch(next);
};

export default mapController;
