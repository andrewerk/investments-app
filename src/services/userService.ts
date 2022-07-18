import UserModel from '../models/UserModel';
import { IUserAdd, IUserToken } from '../interfaces/User'

const createUser = async(user: IUserAdd): Promise<IUserToken> => {
  const { email } = user;
  const userExists = await UserModel.findAll({
    where: {
      email
    }
  });
  if (userExists.length > 0) {
    throw new Error('Email already in use')
  }
  const { id, fullName } = await UserModel.create(user)
  return { id, email, fullName };
}

export default {
  createUser,
}