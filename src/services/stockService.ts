import Sequelize from 'sequelize';
import StockModel from '../models/StockModel';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import generateRandomQuantity from '../utils/randomQuantity';

const saveStockQuantity = async (
  symbol: string,
  stockQuantity: number,
  t: Sequelize.Transaction | null,
) => {
  await StockModel.create({ symbol, stockQuantity }, { transaction: t });
};

// Generates random quantity for current searched stock. If it hasn`t been searched already
// saves value for new Stock;

const getQuantity = async (symbol: string): Promise<number> => {
  const stock = await StockModel.findByPk(symbol);
  if (stock) {
    return stock.stockQuantity;
  }
  const stockQuantity = generateRandomQuantity(100);
  saveStockQuantity(symbol, stockQuantity, null);
  return stockQuantity;
};

const buy = async (
  symbol: string,
  quantity: number,
  t: Sequelize.Transaction | null,
): Promise<void> => {
  const stock = await StockModel.findByPk(symbol);
  if (stock && quantity < stock.stockQuantity) {
    await stock.update({
      stockQuantity: stock.stockQuantity - quantity,
    }, { transaction: t });
    await stock.save({ transaction: t });
    return;
  }
  throw new HttpException(HttpStatusCode.CONFLICT, 'Not enough stocks');
};

const sale = async (
  symbol: string,
  quantity: number,
  t: Sequelize.Transaction | null,
): Promise<void> => {
  const stock = await StockModel.findByPk(symbol);
  await stock!.update({
    stockQuantity: stock!.stockQuantity + quantity,
  }, { transaction: t });
  await stock!.save({ transaction: t });
};

export default {
  saveStockQuantity,
  getQuantity,
  buy,
  sale,
};
