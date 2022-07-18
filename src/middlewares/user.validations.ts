import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import HttpException from '../utils/http.exception';
import HttpStatusCode from '../utils/http.status.code';

const userDTO = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).messages({
  'any.required': '{{#label}} is required',
  'any.string': '{{#label}} must be a string',
  'string.min': '{{#label}} length must be at least {{#limit}} characters long',
  'string.email': '{{#label}} must be a valid email',
});

const addUserValidation = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userDTO.validate(req.body, { abortEarly: false });
  if (!error) {
    return next();
  }
  let errorCode: keyof typeof HttpStatusCode = 'BAD_REQUEST';
  if (error.details[0].type !== 'any.required') errorCode = 'UNPROCESSABLE_ENTITY';
  const messages = error.details.map((e) => e.message);
  throw new HttpException(HttpStatusCode[errorCode], messages[0]);
};

export default addUserValidation;
