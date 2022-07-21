import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import dotenv from 'dotenv';
import UserModel from '../models/UserModel';
import TradeModel from '../models/TradeModel';
import StockModel from '../models/StockModel';
import InvestmentsPortfoliotModel from '../models/InvestmentsPortfolioModel';

dotenv.config();
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USERNAME as string;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DIALECT as Dialect;
const dbPassword = process.env.DB_PASSWORD;
const models = [UserModel, TradeModel, StockModel, InvestmentsPortfoliotModel];

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  models,
  logging: false,
});

export default sequelizeConnection;
