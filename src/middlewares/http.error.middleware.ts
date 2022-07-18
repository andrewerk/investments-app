import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/http.exception';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpErrorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const { status, message } = err as HttpException;
  res.status(status || 500).json({ message });
};

export default httpErrorMiddleware;