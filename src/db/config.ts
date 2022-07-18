import { Sequelize } from 'sequelize-typescript';
import UserModel from '../models/UserModel';

const connection = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'mynewpassword',
  database: 'StockApp',
  logging: false,
  models: [UserModel],
});

connection.query('CREATE DATABASE IF NOT EXISTS StockApp')

export default connection;