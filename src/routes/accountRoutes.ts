import { Router } from 'express';
import accountController from '../controllers/accountController';
import 'express-async-errors';

const accountRoutes = Router();

accountRoutes.post('/deposit', accountController.deposit);

export default accountRoutes;
