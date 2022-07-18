import { Router } from 'express';
import loginController from '../controllers/loginController';
import 'express-async-errors';
import loginValidation from '../middlewares/login.middleware';

const loginRoute = Router();

loginRoute.post('/', loginValidation, loginController.login);

export default loginRoute;
