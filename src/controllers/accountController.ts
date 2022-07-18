import { Request, Response } from 'express';
import accountService from '../services/accountService';
import HttpStatusCode from '../utils/http.status.code';

const deposit = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const { value } = req.body;
  const account = await accountService.deposit(id, value);
  return res.status(HttpStatusCode.OK).json(account);
};

const withdraw = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const { value } = req.body;
  const account = await accountService.withdraw(id, value);
  return res.status(HttpStatusCode.OK).json(account);
};

export default {
  deposit,
  withdraw,
};
