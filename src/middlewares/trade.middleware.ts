import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';

export const tradeDTO = Joi.object({
  symbol: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
}).messages({
  'any.required': '{{#label}} is required',
  'any.number': '{{#label}} must be a number',
  'any.string': '{{#label}} must be a string',
  'number.min': '{{#label}} amount must be greater than zero',

});

const tradeValidation = (req: Request, res: Response, next: NextFunction) => {
  const { error } = tradeDTO.validate(req.body, { abortEarly: false });
  if (!error) {
    return next();
  }
  let errorCode: keyof typeof HttpStatusCode = 'BAD_REQUEST';
  if (error.details[0].type !== 'any.required') errorCode = 'UNPROCESSABLE_ENTITY';
  const messages = error.details.map((e) => e.message);
  throw new HttpException(HttpStatusCode[errorCode], messages[0]);
};

export default tradeValidation;
