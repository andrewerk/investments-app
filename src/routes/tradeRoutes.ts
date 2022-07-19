import { Router } from 'express';
import tradeController from '../controllers/tradeController';
import 'express-async-errors';

const tradeRoutes = Router();

tradeRoutes.get('/user/:type', tradeController.getTradeByType);
tradeRoutes.post('/buy', tradeController.buyStocks);
tradeRoutes.post('/sale', tradeController.saleStocks);
tradeRoutes.get('/', tradeController.getTradeByUser);

export default tradeRoutes;
