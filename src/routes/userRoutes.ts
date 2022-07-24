import { Router } from 'express';
import userController from '../controllers/userController';
import 'express-async-errors';
import userValidation from '../middlewares/user.validations';
import validateToken from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter.post('/', userValidation.addUser, userController.createUser);
userRouter.patch('/pass', validateToken, userValidation.updatePass, userController.changePassword);
userRouter.patch('/', validateToken, userValidation.updateUser, userController.updateUser);

export default userRouter;
