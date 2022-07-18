import express from "express";
import connection from "./db/config";
import routes from './routes';
import 'express-async-errors'

const app = express();

app.use(express.json());

app.use(routes);

connection.sync()

app.listen(3000, () => {
  console.log("Server started on port 3000");
});