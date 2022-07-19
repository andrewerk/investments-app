import { Router } from 'express';
import userController from '../controllers/userController';
import 'express-async-errors';
import addUserValidation from '../middlewares/user.validations';

const userRouter = Router();

userRouter.post('/', addUserValidation, userController.createUser);

export default userRouter;
