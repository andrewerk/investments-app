import Sequelize from 'sequelize';
import accountService from './accountService';
import connection from '../db/config';
import TradeModel from '../models/TradeModel';
import stockApiService from './stockApiService';
import stockService from './stockService';
import ITrade from '../interfaces/Trade';
import investmentsPortfolioService from './investmentsPortfolioService';
import IPortfolio from '../interfaces/Portfolio';
import InvestmentsPortfoliotModel from '../models/InvestmentsPortfolioModel';

const buyStock = async (userId: number, stockSymbol: string, quantity: number) => {
  const stock = await stockApiService.getStock(stockSymbol);
  const { currentValue } = stock;
  const account = await connection.transaction(async (t: Sequelize.Transaction) => {
    const total: number = currentValue * quantity;
    await accountService.withdraw(userId, total, t);
    await stockService.buy(stockSymbol, quantity, t);
    const portfolio = await investmentsPortfolioService
      .buy(userId, stockSymbol, quantity, t) as IPortfolio;
    return portfolio;
  });
  await TradeModel.create({
    portfolioId: account.id, type: 'buy', quantity, value: currentValue,
  });
  return account;
};

const saleStock = async (userId: number, stockSymbol: string, quantity: number) => {
  const stock = await stockApiService.getStock(stockSymbol);
  const { currentValue } = stock;
  const account = await connection.transaction(async (t: Sequelize.Transaction) => {
    const total: number = currentValue * quantity;
    await accountService.deposit(userId, total, t);
    await stockService.sale(stockSymbol, quantity, t);
    const portfolio = await investmentsPortfolioService
      .sale(userId, stockSymbol, quantity, t) as IPortfolio;
    return portfolio;
  });
  await TradeModel.create({
    portfolioId: account.id, type: 'sale', quantity, value: currentValue,
  });
  return account;
};

const getTrades = async (userId: number): Promise<IPortfolio[] | ITrade> => {
  const trades = await InvestmentsPortfoliotModel.scope('records')
    .findAll({
      attributes: ['stockSymbol', 'quantity'],
      where: { userId },
    });
  return trades;
};

const getTradesByType = async (userId: number, type: string): Promise<IPortfolio[] | ITrade> => {
  const trades = await InvestmentsPortfoliotModel.scope('records')
    .findAll({
      attributes: ['stockSymbol', 'quantity'],
      where: { userId },
      include: {
        model: TradeModel,
        attributes: { exclude: ['type'] },
        where: {
          type,
        },
      },
    });
  return trades;
};

export default {
  buyStock,
  saleStock,
  getTrades,
  getTradesByType,
};
