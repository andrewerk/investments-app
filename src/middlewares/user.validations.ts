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

const updateUserDTO = Joi.object({
  fullName: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
}).or('fullName', 'email').required().messages({
  'any.required': '{{#label}} is required',
  'any.string': '{{#label}} must be a string',
  'string.min': '{{#label}} length must be at least {{#limit}} characters long',
  'string.email': '{{#label}} must be a valid email',
});

const updatePassDTO = Joi.object({
  password: Joi.string().min(6).required(),
}).required().messages({
  'any.required': '{{#label}} is required',
  'any.string': '{{#label}} must be a string',
  'string.min': '{{#label}} length must be at least {{#limit}} characters long',
});

const addUser = (req: Request, res: Response, next: NextFunction) => {
  generalValidation(req, res, next, userDTO);
};

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  generalValidation(req, res, next, updateUserDTO);
};

const updatePass = (req: Request, res: Response, next: NextFunction) => {
  generalValidation(req, res, next, updatePassDTO);
};

export default { addUser, updatePass, updateUser };
