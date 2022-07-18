import { Request, Response } from 'express';
import loginService from '../services/loginService';
import generateToken from '../utils/generate.token';
import HttpStatusCode from '../utils/http.status.code';

const login = async (req: Request, res: Response): Promise<Response> => {
  const user = await loginService.login(req.body);
  const token = generateToken(user);
  return res.status(HttpStatusCode.CREATED).json(token);
};

export default {
  login,
};
