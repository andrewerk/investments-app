import { curly } from 'node-libcurl';
// import { IUserAdd, IUserToken } from '../interfaces/User';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import mainStocks from '../utils/mainStocks';
// import Stock from '../interfaces/Stock';

const listPopularStocks = async () => {
  const reqs = mainStocks.map(async (Stock) => {
    const token = 'cbadpm2ad3ickr4mtf4g';
    const url = `https://finnhub.io/api/v1/quote?symbol=${Stock}&token=${token}`;
    const { data } = await curly.get(url);
    if (!data.c) {
      throw new HttpException(HttpStatusCode.TO_MANY_REQUESTS, 'To many requests to external API. Wait one minute');
    }
    return { currentValue: data.c, Stock };
  });
  const stocks = Promise.all(reqs);
  return stocks;
};

export default {
  listPopularStocks,
};
