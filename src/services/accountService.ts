import Sequelize from 'sequelize';
import UserModel from '../models/UserModel';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import Account from '../interfaces/Account';
import { IUser } from '../interfaces/User';

const deposit = async (
  userId: number,
  value: number,
  t: Sequelize.Transaction | null,
): Promise<Account | undefined> => {
  const user = await UserModel.findByPk(userId) as UserModel;
  const updatedUser = await user.update({
    balance: Math.round(user.balance + value),
  }, { transaction: t });
  return { fullName: updatedUser.fullName, balance: updatedUser.balance };
};

const withdraw = async (
  userId: number,
  value: number,
  t: Sequelize.Transaction | null,
): Promise<Account> => {
  const user = await UserModel.findByPk(userId) as UserModel;
  if (user.balance >= value) {
    await UserModel.update(
      {
        balance: Math.round(user.balance - value),
      },
      {
        where: { id: userId },
        transaction: t,
      },
    );
    return { fullName: user.fullName, balance: user.balance - value };
  }
  throw new HttpException(HttpStatusCode.CONFLICT, 'Not possible to proceed with withdraw or sale. Not enough funds');
};

const getById = async (id: number): Promise<Account> => {
  const user = await UserModel.findByPk(id) as IUser;
  const { balance, fullName } = user as { balance: number, fullName: string };
  return { fullName, balance };
};

export default {
  deposit,
  withdraw,
  getById,
};
