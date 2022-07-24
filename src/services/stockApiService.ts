import dotenv from 'dotenv';
import { IStock } from '../interfaces/Stock';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import mainStocks from '../utils/mainStocks';
import stockService from './stockService';
import finnHubClient from '../utils/finnHubClient';

dotenv.config();

const getStock = async (stock: string): Promise<IStock> => {
  const { statusCode, data } = await finnHubClient.fetchValues(stock);
  if (statusCode === 429) {
    throw new HttpException(HttpStatusCode.TO_MANY_REQUESTS, 'To many requests to external API. Wait one minute');
  }
  if (data.c === 0) {
    throw new HttpException(HttpStatusCode.NOT_FOUND, 'Stock not found');
  }
  const stockQuantity = await stockService.getQuantity(stock);
  return { currentValue: data.c, stock, stockQuantity };
};

const listPopularStocks = async (): Promise<IStock[]> => {
  const stocks = Promise.all(mainStocks.map((stock) => getStock(stock)));
  return stocks;
};

export default {
  listPopularStocks,
  getStock,
};
