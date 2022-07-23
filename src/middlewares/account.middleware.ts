import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';

const valueDTO = Joi.object({
  value: Joi.number().min(0).required(),
}).messages({
  'any.required': '{{#label}} is required',
  'any.number': '{{#label}} must be a number',
  'number.min': '{{#label}} amount must be greater than zero',

});

const accountValidation = (req: Request, res: Response, next: NextFunction) => {
  const { error } = valueDTO.validate(req.body, { abortEarly: false });
  if (!error) {
    return next();
  }
  let errorCode: keyof typeof HttpStatusCode = 'BAD_REQUEST';
  if (error.details[0].type !== 'any.required') errorCode = 'UNPROCESSABLE_ENTITY';
  const messages = error.details.map((e) => e.message);
  throw new HttpException(HttpStatusCode[errorCode], messages[0]);
};

export default accountValidation;
