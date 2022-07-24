import Sequelize, { Op } from 'sequelize';
import accountService from './accountService';
import connection from '../db/config';
import TradeModel from '../models/TradeModel';
import stockApiService from './stockApiService';
import stockService from './stockService';
import investmentsPortfolioService from './investmentsPortfolioService';
import IPortfolio from '../interfaces/Portfolio';
import InvestmentsPortfolioModel from '../models/InvestmentsPortfolioModel';
import ITrade from '../interfaces/Trade';

const buyStock = async (userId: number, stockSymbol: string, quantity: number) => {
  const stock = await stockApiService.getStock(stockSymbol);
  const { currentValue } = stock;
  const account = await connection.transaction(async (t: Sequelize.Transaction) => {
    const total: number = currentValue * quantity;
    await accountService.withdraw(userId, total, t);
    await stockService.buy(stockSymbol, quantity, t);
    const portfolio = await investmentsPortfolioService
      .buy(userId, stockSymbol, quantity, t) as IPortfolio;
    await TradeModel.create({
      portfolioId: portfolio.id, type: 'buy', quantity, value: currentValue,
    }, { transaction: t });
    return portfolio;
  });
  return account;
};

const sellStock = async (userId: number, stockSymbol: string, quantity: number) => {
  const stock = await stockApiService.getStock(stockSymbol);
  const { currentValue } = stock;
  const account = await connection.transaction(async (t: Sequelize.Transaction) => {
    const total: number = currentValue * quantity;
    await accountService.deposit(userId, total, t);
    await stockService.sell(stockSymbol, quantity, t);
    const portfolio = await investmentsPortfolioService
      .sell(userId, stockSymbol, quantity, t) as IPortfolio;
    await TradeModel.create({
      portfolioId: portfolio.id, type: 'sell', quantity, value: currentValue,
    }, { transaction: t });
    return portfolio;
  });
  return account;
};

const getTrades = async (userId: number): Promise<ITrade[]> => {
  const assets = await InvestmentsPortfolioModel.findAll({
    attributes: ['id', 'stockSymbol'],
    where: { userId },
  });
  const portfolioIds = assets.map((asset) => asset.id);
  const trades = await TradeModel.findAll({
    where: {
      portfolioId: {
        [Op.in]: portfolioIds,
      },
    },
    include: {
      model: InvestmentsPortfolioModel,
      attributes: ['stockSymbol'],
    },
  });
  return trades;
};

const getTradesByType = async (userId: number, type: string):
Promise<ITrade[]> => {
  const trades = await getTrades(userId);
  const tradeByType = trades.filter((trade) => trade.type === type);
  return tradeByType;
};

export default {
  buyStock,
  sellStock,
  getTrades,
  getTradesByType,
};
