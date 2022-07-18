import UserModel from '../models/UserModel';
import { IUserAdd, IUserToken } from '../interfaces/User'
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';

const createUser = async(user: IUserAdd): Promise<IUserToken> => {
  const { email } = user;
  const userExists = await UserModel.findAll({
    where: {
      email
    }
  });
  if (userExists.length > 0) {
    throw new HttpException(HttpStatusCode.CONFLICT,'Email already in use')
  }
  const { id } = await UserModel.create(user)
  return { id, email };
}

export default {
  createUser,
}