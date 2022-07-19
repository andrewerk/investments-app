import { sign, SignOptions } from 'jsonwebtoken';
import { IUserToken } from '../interfaces/User';

const secret = process.env.SECRET || 'jwtsecret';

const jwtConfig: SignOptions = {
  expiresIn: '50m',
  algorithm: 'HS256',
};

const generateToken = (data: IUserToken): string => sign(data, secret, jwtConfig);

export default generateToken;
