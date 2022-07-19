import Sequelize from 'sequelize';
import InvestmentsPortfolioModel from '../models/InvestmentsPortfolioModel';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import IPortfolio from '../interfaces/Portfolio';
import insertValue from '../utils/insertValue';

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
    return { id: asset.id, stockSymbol, quantity: asset.quantity };
  }
  return { id: asset.id, stockSymbol, quantity };
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
    return { id: asset.id, stockSymbol, quantity: asset.quantity };
  }
  throw new HttpException(HttpStatusCode.CONFLICT, `Customer can only sell ${asset.quantity} assets`);
};

const getAssetsByCustomer = async (id: number): Promise<IPortfolio[]> => {
  const userAssets = await InvestmentsPortfolioModel.findAll({ where: { userId: id } });
  const userAssetsValues = await insertValue(userAssets);
  return userAssetsValues;
};

const getAssetByCustomerHistory = async (
  id: number,
  stockSymbol: string,
): Promise<IPortfolio> => {
  const userAsset = await InvestmentsPortfolioModel.scope('records').findOne(
    { where: { userId: id, stockSymbol } },
  ) as InvestmentsPortfolioModel;
  return userAsset;
};

export default {
  buy,
  sale,
  getAssetsByCustomer,
  getAssetByCustomerHistory,
};
