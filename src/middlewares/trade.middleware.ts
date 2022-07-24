import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import generalValidation from './dto.validation';

export const tradeDTO = Joi.object({
  symbol: Joi.string().required(),
  quantity: Joi.number().greater(0).required(),
}).messages({
  'any.required': '{{#label}} is required',
  'any.number': '{{#label}} must be a number',
  'any.string': '{{#label}} must be a string',
  'number.greater': '{{#label}} amount must be greater than zero',

});

const tradeValidation = (req: Request, res: Response, next: NextFunction) => {
  generalValidation(req, res, next, tradeDTO);
};

export default tradeValidation;
