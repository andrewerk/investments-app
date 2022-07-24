import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import generalValidation from './dto.validation';

const loginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).messages({
  'any.required': '{{#label}} is required',
  'string.min': '{{#label}} length must be at least {{#limit}} characters long',
  'string.email': '{{#label}} must be a valid email',
});

const loginValidation = (req: Request, res: Response, next: NextFunction) => {
  generalValidation(req, res, next, loginDTO);
};

export default loginValidation;
