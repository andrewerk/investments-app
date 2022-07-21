import { sign, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUserToken } from '../interfaces/User';

dotenv.config();

const secret = process.env.JWT_SECRET as string;

const jwtConfig: SignOptions = {
  expiresIn: '50m',
  algorithm: 'HS256',
};

const generateToken = (data: IUserToken): string => sign(data, secret, jwtConfig);

export default generateToken;
