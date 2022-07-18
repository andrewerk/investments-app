import { Router } from "express";
import loginController from '../controllers/loginController';
import 'express-async-errors'

const loginRoute = Router();

loginRoute.post('/', loginController.login)

export default loginRoute;