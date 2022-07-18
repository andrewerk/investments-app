import { Router } from 'express';
import loginRoute from './loginRoute';
import userRouter from './userRoutes';
import accountRoutes from './accountRoutes';
import validateToken from '../middlewares/auth.middleware';
import addUserValidation from '../middlewares/user.validations';

const routes = Router();

routes.use('/users', addUserValidation, userRouter);
routes.use('/login', loginRoute);
routes.use('/account', validateToken, accountRoutes);

export default routes;
