import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';
import { IUser, IUserAdd, IUserToken } from '../interfaces/User';
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

const updateUser = async (id: number, {
  fullName, email,
}: IUserAdd): Promise<IUser> => {
  const [, updated] = await UserModel.update(
    {
      fullName, email,
    },
    {
      where: { id },
      returning: true,
    },
  );
  return { fullName: updated[0].fullName, email: updated[0].email };
};

const changePassword = async (id: number, password: string): Promise<void> => {
  const salt = bcrypt.genSaltSync(10);
  const newPassword = bcrypt.hashSync(password, salt);
  await UserModel.update({ password: newPassword }, { where: { id } });
};

export default {
  createUser,
  updateUser,
  changePassword,
};
