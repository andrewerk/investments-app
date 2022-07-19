import { Router } from 'express';
import loginRoute from './loginRoute';
import userRouter from './userRoutes';
import accountRoutes from './accountRoutes';
import validateToken from '../middlewares/auth.middleware';
import addUserValidation from '../middlewares/user.validations';
import stocksRoutes from './stocksRoutes';

const routes = Router();

routes.use('/users', addUserValidation, userRouter);
routes.use('/login', loginRoute);
routes.use('/account', validateToken, accountRoutes);
routes.use('/stocks', stocksRoutes);

export default routes;
