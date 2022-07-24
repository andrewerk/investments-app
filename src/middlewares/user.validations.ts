import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import generalValidation from './dto.validation';

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
  generalValidation(req, res, next, userDTO);
};

export default addUserValidation;
