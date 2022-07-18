import UserModel from '../models/UserModel';
import { IUserAdd, IUserToken } from '../interfaces/User'
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import Account from '../interfaces/Account';

const deposit = async(userId: number, value: number): Promise<Account> => {
  const user = await UserModel.findByPk(userId);
  if (user) {
    await user.update({
      balance: user.balance + value
    });
    await user.save();
    return { fullName: user.fullName, balance: user.balance}
  }
  throw new HttpException(HttpStatusCode.CONFLICT, 'Not possible to proceed with deposit. Try again in a few minutes');

}

export default {
  deposit,
}