import { sign, SignOptions } from 'jsonwebtoken';
import { IUserToken } from '../interfaces/User';

const secret = process.env.SECRET || 'jwtsecret';

const jwtConfig: SignOptions = {
  expiresIn: '15m',
  algorithm: 'HS256',
};

const generateToken = (data: IUserToken): string => {
  return sign(data, secret, jwtConfig);
}

export default generateToken;
