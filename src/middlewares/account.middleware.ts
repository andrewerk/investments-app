import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import generalValidation from './dto.validation';

const valueDTO = Joi.object({
  value: Joi.number().greater(0).required(),
}).messages({
  'any.required': '{{#label}} is required',
  'any.number': '{{#label}} must be a number',
  'number.greater': '{{#label}} amount must be greater than zero',

});

const accountValidation = (req: Request, res: Response, next: NextFunction) => {
  generalValidation(req, res, next, valueDTO);
};

export default accountValidation;
