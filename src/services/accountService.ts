import Sequelize from 'sequelize';
import UserModel from '../models/UserModel';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import Account from '../interfaces/Account';

const deposit = async (
  userId: number,
  value: number,
  t: Sequelize.Transaction | null,
): Promise<Account> => {
  const user = await UserModel.findByPk(userId);
  if (user) {
    await user.update({
      balance: user.balance + value,
    }, { transaction: t });
    await user.save({ transaction: t });
    return { fullName: user.fullName, balance: user.balance };
  }
  throw new HttpException(HttpStatusCode.CONFLICT, 'Not possible to proceed with deposit. Try again in a few minutes');
};

const withdraw = async (
  userId: number,
  value: number,
  t: Sequelize.Transaction | null,
): Promise<Account> => {
  const user = await UserModel.findByPk(userId);
  if (user && user.balance >= value) {
    await user.update({
      balance: user.balance - value,
    }, { transaction: t });
    await user.save({ transaction: t });
    return { fullName: user.fullName, balance: user.balance };
  }
  throw new HttpException(HttpStatusCode.CONFLICT, 'Not possible to proceed with withdraw or sale. Not enough founds');
};

const getById = async (id: number): Promise<Account> => {
  const user = await UserModel.findByPk(id);
  return { fullName: user!.fullName, balance: user!.balance };
};

export default {
  deposit,
  withdraw,
  getById,
};
