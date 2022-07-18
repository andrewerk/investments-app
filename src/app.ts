import express from 'express';
import connection from './db/config';
import routes from './routes';
import 'express-async-errors';
import httpErrorMiddleware from './middlewares/http.error.middleware';

const app = express();

app.use(express.json());

app.use(routes);

app.use(httpErrorMiddleware);

connection.sync();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to port ${port}`);
});
