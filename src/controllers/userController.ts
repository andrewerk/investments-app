import { Request, Response } from 'express';
import userService from '../services/userService';
import generateToken from '../utils/generate.token';
import HttpStatusCode from '../utils/http.status.code';

const createUser = async (req: Request, res: Response): Promise<Response> => {
  const newUser = await userService.createUser(req.body);
  const token = generateToken(newUser);
  return res.status(HttpStatusCode.CREATED).json({ token });
};

const notallowed = async (req: Request, res: Response): Promise<Response> => {
  const response = 'Method not allowed';
  return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ response });
};

export default {
  createUser,
  notallowed,
};
