import { curly } from 'node-libcurl';
import { Stock } from '../interfaces/Stock';
import ExternalApiErrors from '../utils/apiErrors';
import mainStocks from '../utils/mainStocks';
import stockService from './stockService';

const token = 'cbadpm2ad3ickr4mtf4g';

const getStock = async (stock: string): Promise<Stock> => {
  const url = `https://finnhub.io/api/v1/quote?symbol=${stock}&token=${token}`;
  const { statusCode, data } = await curly.get(url);
  if (statusCode === 429) {
    ExternalApiErrors.TO_MANY_REQUESTS();
  }

  // Deve ser refatorado
  if (data.c === 0) {
    ExternalApiErrors.NOT_FOUND();
  }
  const stockQuantity = await stockService.getQuantity(stock);
  return { currentValue: data.c, stock, stockQuantity };
};

const listPopularStocks = async (): Promise<Stock[]> => {
  const stocks = Promise.all(mainStocks.map((stock) => getStock(stock)));
  return stocks;
};

export default {
  listPopularStocks,
  getStock,
};
