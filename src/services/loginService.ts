import UserModel from '../models/UserModel';
import { IUserAdd, IUserToken } from '../interfaces/User'
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import bcrypt from 'bcrypt'

const login = async(user: IUserAdd): Promise<IUserToken> => {
  const { email, password } = user;
  const userExists = await UserModel.findOne({
    where: {
      email
    }
  });
  if (!userExists) {
    throw new HttpException(HttpStatusCode.NOT_FOUND,'Email not registered')
  }
  if (await bcrypt.compare(password, userExists.password)) {
    return { id: userExists.id, email}
  }
  throw new HttpException(HttpStatusCode.UNAUTHORIZED, 'Incorrect password')
}

export default {
  login,
}