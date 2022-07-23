import { Request, Response } from 'express';
import tradeService from '../services/tradeService';
import HttpStatusCode from '../utils/http.status.code';

const buyStocks = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const { symbol, quantity } = req.body;
  const result = await tradeService.buyStock(id, symbol.toUpperCase(), quantity);
  return res.status(HttpStatusCode.OK).json(result);
};

const sellStocks = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const { symbol, quantity } = req.body;
  const result = await tradeService.sellStock(id, symbol.toUpperCase(), quantity);
  return res.status(HttpStatusCode.OK).json(result);
};

const getTradeByUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const result = await tradeService.getTrades(id);
  return res.status(HttpStatusCode.OK).json(result);
};

const getTradeByType = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const { type } = req.params;
  const result = await tradeService.getTradesByType(id, type);
  return res.status(HttpStatusCode.OK).json(result);
};

export default {
  buyStocks,
  sellStocks,
  getTradeByUser,
  getTradeByType,
};
