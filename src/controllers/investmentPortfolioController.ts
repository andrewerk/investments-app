import { Request, Response } from 'express';
import investmentsPortfolioService from '../services/investmentsPortfolioService';
import HttpStatusCode from '../utils/http.status.code';

const getAssetsByCustomer = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const assets = await investmentsPortfolioService.getAssetsByCustomer(id);
  return res.status(HttpStatusCode.OK).json(assets);
};

const getAssetByCustomerHistory = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const { asset } = req.params;
  const assets = await investmentsPortfolioService
    .getAssetByCustomerHistory(id, asset.toUpperCase());
  return res.status(HttpStatusCode.OK).json(assets);
};

export default {
  getAssetByCustomerHistory,
  getAssetsByCustomer,
};
