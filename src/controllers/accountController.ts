import { Request, Response } from 'express';
import accountService from '../services/accountService';
import HttpStatusCode from '../utils/http.status.code';

const deposit = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const { value } = req.body;
  const account = await accountService.deposit(id, value, null);
  return res.status(HttpStatusCode.OK).json(account);
};

const withdraw = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const { value } = req.body;
  const account = await accountService.withdraw(id, value, null);
  return res.status(HttpStatusCode.OK).json(account);
};

const check = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const account = await accountService.getById(id);
  return res.status(HttpStatusCode.OK).json(account);
};

export default {
  deposit,
  withdraw,
  check,
};
