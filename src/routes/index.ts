import { Router } from 'express';
import loginRoute from './loginRoute';
import userRouter from './userRoutes';
import accountRoutes from './accountRoutes';
import validateToken from '../middlewares/auth.middleware';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/login', loginRoute);
routes.use('/account', validateToken, accountRoutes);

export default routes;
