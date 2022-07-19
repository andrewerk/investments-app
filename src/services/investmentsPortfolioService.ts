import Sequelize from 'sequelize';
import InvestmentsPortfolioModel from '../models/InvestmentsPortfolioModel';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import IPortfolio from '../interfaces/Portfolio';

const buy = async (
  userId: number,
  stockSymbol: string,
  quantity: number,
  t: Sequelize.Transaction | null,
): Promise<IPortfolio> => {
  const [asset, created] = await InvestmentsPortfolioModel
    .findOrCreate({
      where: { userId, stockSymbol },
      defaults: { userId, stockSymbol, quantity },
      transaction: t,
    });
  if (!created) {
    await asset.update({
      quantity: asset.quantity + quantity,
    }, { transaction: t });
    await asset.save({ transaction: t });
    return { userId, stockSymbol, quantity: asset.quantity };
  }
  return { userId, stockSymbol, quantity };
};

const sale = async (
  userId: number,
  stockSymbol: string,
  quantity: number,
  t: Sequelize.Transaction | null,
): Promise<IPortfolio> => {
  const asset = await InvestmentsPortfolioModel.findOne({
    where: { userId, stockSymbol },
  }) as InvestmentsPortfolioModel;
  if (!asset) {
    throw new HttpException(HttpStatusCode.CONFLICT, 'Customer does not owns any of these assets');
  }
  if (asset.quantity >= quantity) {
    await asset.update({
      quantity: asset.quantity - quantity,
    }, { transaction: t });
    await asset.save({ transaction: t });
    return { userId, stockSymbol, quantity: asset.quantity };
  }
  throw new HttpException(HttpStatusCode.CONFLICT, 'Not enough assets to sell');
};

// const getById = async (id: number): Promise<Account> => {
//   const user = await UserModel.findByPk(id);
//   return { fullName: user!.fullName, balance: user!.balance };
// };

export default {
  buy,
  sale,
  // getById,
};
