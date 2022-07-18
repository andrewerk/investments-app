import express from "express";
import connection from "./db/config";
import routes from './routes';
import 'express-async-errors'

const app = express();

app.use(express.json());

app.use(routes);

connection.sync()

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});