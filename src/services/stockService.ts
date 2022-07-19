import Sequelize from 'sequelize';
import StockModel from '../models/StockModel';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import generateRandomQuantity from '../utils/randomQuantity';

// Generates random quantity for current searched stock. If it hasn`t been searched already
// saves value for new Stock;

const getQuantity = async (symbol: string): Promise<number> => {
  const stockQuantity = generateRandomQuantity(100);
  const [stock] = await StockModel.findOrCreate({
    where: { symbol },
    defaults: { symbol, stockQuantity },
  });

  return stock.stockQuantity;
};

const buy = async (
  symbol: string,
  quantity: number,
  t: Sequelize.Transaction | null,
): Promise<void> => {
  const stock = await StockModel.findByPk(symbol) as StockModel;
  if (quantity < stock.stockQuantity) {
    await stock.update({
      stockQuantity: stock.stockQuantity - quantity,
    }, { transaction: t });
    await stock.save({ transaction: t });
    return;
  }
  throw new HttpException(HttpStatusCode.CONFLICT, `Only ${stock.stockQuantity} are available to sale`);
};

const sale = async (
  symbol: string,
  quantity: number,
  t: Sequelize.Transaction | null,
): Promise<void> => {
  const stock = await StockModel.findByPk(symbol) as StockModel;
  await stock.update({
    stockQuantity: stock!.stockQuantity + quantity,
  }, { transaction: t });
  await stock.save({ transaction: t });
};

export default {
  getQuantity,
  buy,
  sale,
};
