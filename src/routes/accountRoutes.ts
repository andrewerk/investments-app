import { Router } from 'express';
import accountController from '../controllers/accountController';
import 'express-async-errors';
import accountValidation from '../middlewares/account.middleware';
import investmentPortfolioController from '../controllers/investmentPortfolioController';

const accountRoutes = Router();

accountRoutes.post('/deposit', accountValidation, accountController.deposit);
accountRoutes.post('/withdraw', accountValidation, accountController.withdraw);
accountRoutes.get('/earnings/:stock', investmentPortfolioController.getEarningByStock);
accountRoutes.get('/earnings/', investmentPortfolioController.getTotalEarnings);
accountRoutes.get('/', accountController.check);

export default accountRoutes;
