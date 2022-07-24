import Sequelize from 'sequelize';
import InvestmentsPortfolioModel from '../models/InvestmentsPortfolioModel';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import IPortfolio from '../interfaces/Portfolio';
import insertValue from '../utils/insertValue';
import calculateEarnings from '../utils/calculateEarning';

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
    const [, updatedAsset] = await InvestmentsPortfolioModel.update(
      {
        quantity: asset.quantity + quantity,
      },
      {
        where: { userId, stockSymbol },
        transaction: t,
        returning: true,
      },
    );
    return { id: asset.id, stockSymbol, quantity: updatedAsset[0].quantity };
  }
  return { id: asset.id, stockSymbol, quantity: asset.quantity };
};

const sell = async (
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
    const [, updatedAsset] = await InvestmentsPortfolioModel.update(
      {
        quantity: asset.quantity - quantity,
      },
      {
        where: { userId, stockSymbol },
        transaction: t,
        returning: true,
      },
    );
    return { id: asset.id, stockSymbol, quantity: updatedAsset[0].quantity };
  }
  throw new HttpException(HttpStatusCode.CONFLICT, `Assets available to sell: ${asset.quantity}`);
};

const getAssetsByCustomer = async (userId: number): Promise<IPortfolio[]> => {
  const userAssets = await InvestmentsPortfolioModel.findAll({ where: { userId } });
  const userAssetsValues = await insertValue(userAssets);
  return userAssetsValues;
};

const getAssetByCustomerHistory = async (
  userId: number,
  stockSymbol: string,
): Promise<IPortfolio> => {
  const userAsset = await InvestmentsPortfolioModel.scope('records').findOne(
    { where: { userId, stockSymbol } },
  ) as InvestmentsPortfolioModel;
  if (!userAsset) {
    throw new HttpException(HttpStatusCode.NOT_FOUND, 'No assets found');
  }
  const userAssetsValues = await insertValue([userAsset]);
  return userAssetsValues[0];
};

const getEarningByStock = async (
  userId: number,
  stockSymbol: string,
): Promise<number> => {
  const userAsset = await getAssetByCustomerHistory(userId, stockSymbol);
  if (userAsset.trades && stockSymbol) {
    const totalEarnings = calculateEarnings(userAsset, userAsset.trades);
    return Number(totalEarnings.toFixed(2));
  }
  throw new HttpException(HttpStatusCode.NOT_FOUND, 'No assets found');
};

const getTotalEarnings = async (userId: number) => {
  const assets = await InvestmentsPortfolioModel.findAll({ where: { userId } });
  if (assets.length === 0) {
    throw new HttpException(HttpStatusCode.NOT_FOUND, 'No assets found');
  }
  const totalEarningsArr = await Promise
    .all(assets.map((asset) => getEarningByStock(userId, asset.stockSymbol)));
  const totalEarnings = totalEarningsArr.reduce((prev: number, current: number) => prev + current);
  return totalEarnings;
};

export default {
  buy,
  sell,
  getAssetsByCustomer,
  getAssetByCustomerHistory,
  getEarningByStock,
  getTotalEarnings,
};
