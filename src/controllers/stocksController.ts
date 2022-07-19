import { Request, Response } from 'express';
import stockApiService from '../services/stockApiService';
import HttpStatusCode from '../utils/http.status.code';

const listStocks = async (req: Request, res: Response): Promise<Response> => {
  const stocks = await stockApiService.listPopularStocks();
  return res.status(HttpStatusCode.OK).json(stocks);
};

export default {
  listStocks,
};
