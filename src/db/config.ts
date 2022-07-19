import { Sequelize } from 'sequelize-typescript';
import UserModel from '../models/UserModel';
import TradeModel from '../models/TradeModel';
import StockModel from '../models/StockModel';
import InvestmentsPortfoliotModel from '../models/InvestmentsPortfolioModel';

const connection = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'mynewpassword',
  database: 'StockApp',
  logging: false,
  models: [UserModel, TradeModel, StockModel, InvestmentsPortfoliotModel],
});

connection.query('CREATE DATABASE IF NOT EXISTS StockApp');

export default connection;
