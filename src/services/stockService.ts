import Sequelize from 'sequelize';
import StockModel from '../models/StockModel';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';
import randomQuantity from '../utils/randomQuantity';

// Generates random quantity for current searched stock. If it hasn`t been searched already
// saves value for new Stock;

const getQuantity = async (symbol: string): Promise<number> => {
  const stockQuantity = randomQuantity.generateRandomQuantity(100);
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
): Promise<number> => {
  const stock = await StockModel.findByPk(symbol) as StockModel;
  if (quantity <= stock.stockQuantity) {
    await StockModel.update(
      {
        stockQuantity: stock.stockQuantity - quantity,
      },
      {
        where: { symbol },
        transaction: t,
      },
    );
    return stock.stockQuantity - quantity;
  }
  throw new HttpException(HttpStatusCode.CONFLICT, `Quantity available to sell: ${stock.stockQuantity}`);
};

const sale = async (
  symbol: string,
  quantity: number,
  t: Sequelize.Transaction | null,
): Promise<number> => {
  const stock = await StockModel.findByPk(symbol) as StockModel;
  await StockModel.update(
    {
      stockQuantity: stock.stockQuantity + quantity,
    },
    {
      where: { symbol },
      transaction: t,
    },
  );
  return stock.stockQuantity + quantity;
};

export default {
  getQuantity,
  buy,
  sale,
};
