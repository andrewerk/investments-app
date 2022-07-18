import { Request, Response } from 'express';
import userService from '../services/userService';
import generateToken from '../utils/generateToken';

const createUser = async (req: Request, res: Response): Promise<Response> => {
  const newUser = await userService.createUser(req.body);
  const token = generateToken(newUser);
  return res.status(201).json(token);
}

export default {
  createUser
}