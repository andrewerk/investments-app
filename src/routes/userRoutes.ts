import { Router } from "express";
import userController from '../controllers/userController';
import 'express-async-errors'

const userRouter = Router();

userRouter.post('/', userController.createUser)

export default userRouter;