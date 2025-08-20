import { getRain1hData } from "../services/chartService.js";

const chartController = async (req, res, next) => {
  getRain1hData()
    .then((data) => res.status(200).json({ rainValue: data }))
    .catch(next);
    
};

export default chartController;
