import { Router } from 'express';
import portfolioController from '../controllers/portfolioController';
import 'express-async-errors';

const portfolioRoute = Router();

portfolioRoute.get('/:asset', portfolioController.getAssetByCustomerHistory);
portfolioRoute.get('/', portfolioController.getAssetsByCustomer);

export default portfolioRoute;
