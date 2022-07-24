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

const getEarningByStock = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const { stock } = req.params;
  const earnings = await investmentsPortfolioService
    .getEarningByStock(id, stock.toUpperCase());
  return res.status(HttpStatusCode.OK).json(earnings);
};

const getTotalEarnings = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const earnings = await investmentsPortfolioService
    .getTotalEarnings(id);
  return res.status(HttpStatusCode.OK).json(earnings);
};

export default {
  getAssetByCustomerHistory,
  getAssetsByCustomer,
  getEarningByStock,
  getTotalEarnings,
};
