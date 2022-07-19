import { Router } from 'express';
import accountController from '../controllers/accountController';
import 'express-async-errors';
import accountValidation from '../middlewares/account.middleware';

const accountRoutes = Router();
accountRoutes.get('/', accountController.check);
accountRoutes.post('/deposit', accountValidation, accountController.deposit);
accountRoutes.post('/withdraw', accountValidation, accountController.withdraw);

export default accountRoutes;
