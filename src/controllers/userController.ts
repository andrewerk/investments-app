import { Request, Response } from 'express';
import userService from '../services/userService';
import generateToken from '../utils/generate.token';
import HttpStatusCode from '../utils/http.status.code';

const createUser = async (req: Request, res: Response): Promise<Response> => {
  const newUser = await userService.createUser(req.body);
  const token = generateToken(newUser);
  return res.status(HttpStatusCode.CREATED).json({ token });
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  const updatedUser = await userService.updateUser(id, req.body);
  return res.status(HttpStatusCode.OK).json({ updatedUser });
};

const changePassword = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.user;
  await userService.changePassword(id, req.body.password);
  return res.status(HttpStatusCode.NO_CONTENT).end();
};

const notallowed = async (req: Request, res: Response): Promise<Response> => {
  const response = 'Method not allowed';
  return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ response });
};

export default {
  createUser,
  notallowed,
  updateUser,
  changePassword,
};
