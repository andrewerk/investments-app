import Sequelize from 'sequelize';
import UserModel from '../models/UserModel';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import IAccount from '../interfaces/Account';
import { IUser } from '../interfaces/User';

const deposit = async (
  userId: number,
  value: number,
  t: Sequelize.Transaction | null,
): Promise<IAccount | undefined> => {
  const user = await UserModel.findByPk(userId) as UserModel;
  const updatedUser = await user.update({
    balance: Number((user.balance + value).toFixed(2)),
  }, { transaction: t });
  return { fullName: updatedUser.fullName, balance: updatedUser.balance };
};

const withdraw = async (
  userId: number,
  value: number,
  t: Sequelize.Transaction | null,
): Promise<IAccount> => {
  const user = await UserModel.findByPk(userId) as UserModel;
  if (user.balance >= value) {
    await UserModel.update(
      {
        balance: Number((user.balance - value).toFixed(2)),
      },
      {
        where: { id: userId },
        transaction: t,
      },
    );
    return { fullName: user.fullName, balance: user.balance - value };
  }
  throw new HttpException(HttpStatusCode.CONFLICT, 'Not possible to proceed with withdraw or sell. Not enough funds');
};

const getById = async (id: number): Promise<IAccount> => {
  const user = await UserModel.findByPk(id) as IUser;
  const { balance, fullName } = user as { balance: number, fullName: string };
  return { fullName, balance };
};

export default {
  deposit,
  withdraw,
  getById,
};
