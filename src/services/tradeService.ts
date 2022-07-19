import Sequelize from 'sequelize';
import accountService from './accountService';
import connection from '../db/config';
import TradeModel from '../models/TradeModel';
import stockApiService from './stockApiService';
import stockService from './stockService';
import ITrade from '../interfaces/Trade';

const buyStock = async (userId: number, stockSymbol: string, quantity: number) => {
  const stock = await stockApiService.getStock(stockSymbol);
  const { currentValue } = stock;
  const account = await connection.transaction(async (t: Sequelize.Transaction) => {
    const total: number = currentValue * quantity;
    const accountAfterBuy = await accountService.withdraw(userId, total, t);
    await stockService.buy(stockSymbol, quantity, t);
    return accountAfterBuy;
  });
  await TradeModel.create({
    userId, stockSymbol, type: 'buy', quantity, value: currentValue,
  });
  return account;
};

const saleStock = async (userId: number, stockSymbol: string, quantity: number) => {
  const stock = await stockApiService.getStock(stockSymbol);
  const { currentValue } = stock;
  const account = await connection.transaction(async (t: Sequelize.Transaction) => {
    const total: number = currentValue * quantity;
    const accountAfterSale = await accountService.deposit(userId, total, t);
    await stockService.sale(stockSymbol, quantity, t);
    return accountAfterSale;
  });
  await TradeModel.create({
    userId, stockSymbol, type: 'sale', quantity, value: currentValue,
  });
  return account;
};

const getTrades = async (userId: number): Promise<ITrade[]> => {
  const trades = await TradeModel.findAll({ where: { userId } });
  return trades!;
};

const getTradesByType = async (userId: number, type: string): Promise<ITrade[]> => {
  const trades = await TradeModel.findAll({ where: { userId, type } });
  return trades!;
};

export default {
  buyStock,
  saleStock,
  getTrades,
  getTradesByType,
};
