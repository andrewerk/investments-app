import UserModel from '../models/UserModel';
import { IUser, IUserToken } from '../interfaces/User';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';

const createUser = async (user: IUser): Promise<IUserToken> => {
  const { email } = user;
  const [{ id }, created] = await UserModel.findOrCreate({
    where: { email },
    defaults: user,
  });
  if (!created) {
    throw new HttpException(HttpStatusCode.CONFLICT, 'Email already in use');
  }
  return { id, email };
};

export default {
  createUser,
};
