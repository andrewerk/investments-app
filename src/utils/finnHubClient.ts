import fetch from 'node-fetch';
import dotenv from 'dotenv';
import backUp from './backupFile';
import HttpStatusCode from './http.status.code';

dotenv.config();

const token = process.env.API_TOKEN;

export interface ApiResponse {
  statusCode: number,
  data: ApiData
}

export interface ApiData {
  c: number,
  d?: number,
  dp?: number,
  h?: number,
  l?: number,
  o?: number,
  pc?: number,
  t?: number,
}

const fetchValues = async (stock: string): Promise<ApiResponse> => {
  if (process.env.EXTERNAL_API === 'true') {
    const url = `https://finnhub.io/api/v1/quote?symbol=${stock}&token=${token}`;
    const response = await fetch(url);
    const statusCode = response.status;
    const data = await response.json();
    return { data, statusCode };
  }
  const stockBackUp = backUp.find((storageStock) => storageStock.stock === stock);
  if (stockBackUp) {
    return { statusCode: HttpStatusCode.OK, data: { c: stockBackUp.currentValue } };
  }
  return { statusCode: HttpStatusCode.NOT_FOUND, data: { c: 0 } };
};

export default {
  fetchValues,
};
