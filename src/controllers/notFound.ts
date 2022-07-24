import { Request, Response } from 'express';
import HttpStatusCode from '../utils/http.status.code';

const notFound = async (req: Request, res: Response): Promise<Response> => {
  const message = 'Not Found';
  return res.status(HttpStatusCode.NOT_FOUND).json({ message });
};

export default notFound;
