import { Router } from "express";
import loginRoute from './loginRoute';
import userRouter from './userRoutes';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/login', loginRoute);

export default routes;