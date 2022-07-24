import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import loginRoute from './loginRoute';
import userRouter from './userRoutes';
import accountRoutes from './accountRoutes';
import validateToken from '../middlewares/auth.middleware';
import stocksRoutes from './stocksRoutes';
import tradeRoutes from './tradeRoutes';
import investmentPortfolioRoute from './portfolioRoutes';
import userController from '../controllers/userController';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/login', loginRoute);
routes.use('/account', validateToken, accountRoutes);
routes.use('/stocks', validateToken, stocksRoutes);
routes.use('/investments', validateToken, tradeRoutes);
routes.use('/assets', validateToken, investmentPortfolioRoute);
routes.use('/docs', swaggerUi.serve, swaggerUi.setup(require('../../swagger.json')));

routes.use('/*', userController.notallowed);

export default routes;
