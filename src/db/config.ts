import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';

const connection = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'mynewpassword',
  database: 'StockApp',
  logging: false,
  models: [User],
});

connection.query('CREATE DATABASE IF NOT EXISTS StockApp')

export default connection;