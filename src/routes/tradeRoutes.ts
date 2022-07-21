import { Router } from 'express';
import tradeController from '../controllers/tradeController';
import 'express-async-errors';
import tradeValidation from '../middlewares/trade.middleware';

const tradeRoutes = Router();

tradeRoutes.get('/user/:type', tradeController.getTradeByType);
tradeRoutes.post('/buy', tradeValidation, tradeController.buyStocks);
tradeRoutes.post('/sale', tradeValidation, tradeController.saleStocks);
tradeRoutes.get('/', tradeController.getTradeByUser);

export default tradeRoutes;
