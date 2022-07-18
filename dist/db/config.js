"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("../models/User");
const connection = new sequelize_typescript_1.Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'mynewpassword',
    database: 'StockApp',
    logging: false,
    models: [User_1.User],
});
connection.query('CREATE DATABASE IF NOT EXISTS StockApp');
exports.default = connection;
