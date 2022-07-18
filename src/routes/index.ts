import { Router } from "express";
import userRouter from './userRoutes';
import 'express-async-errors'

const routes = Router();

routes.use('/users', userRouter);

export default routes;