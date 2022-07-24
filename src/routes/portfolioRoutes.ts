import { Router } from 'express';
import investmentsPortfolioController from '../controllers/investmentPortfolioController';
import 'express-async-errors';

const investmentPortfolioRoute = Router();

investmentPortfolioRoute.get('/:asset', investmentsPortfolioController.getAssetByCustomerHistory);
investmentPortfolioRoute.get('/', investmentsPortfolioController.getAssetsByCustomer);

export default investmentPortfolioRoute;
