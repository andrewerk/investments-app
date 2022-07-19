import { Router } from 'express';
import stocksController from '../controllers/stocksController';
import 'express-async-errors';

const stocksRoutes = Router();

stocksRoutes.get('/', stocksController.listStocks);

export default stocksRoutes;
