import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';
import { IUserLogin, IUserToken } from '../interfaces/User';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';

const login = async (user: IUserLogin): Promise<IUserToken> => {
  const { email, password } = user;
  const userExists = await UserModel.findOne({
    where: {
      email,
    },
  });
  if (!userExists) {
    throw new HttpException(HttpStatusCode.UNAUTHORIZED, 'Invalid credentials');
  }
  if (await bcrypt.compare(password, userExists.password)) {
    return { id: userExists.id, email };
  }
  throw new HttpException(HttpStatusCode.UNAUTHORIZED, 'Invalid credentials');
};

export default {
  login,
};
