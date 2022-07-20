import sinon from 'sinon';
import { expect } from 'chai';
import UserModel from '../../../models/UserModel';
import HttpException from '../../../utils/http.exception';
import HttpStatusCode from '../../../utils/http.status.code';
import userService from '../../../services/userService';

describe('Test createUser service', () => {
  it('Test createUSer for existent user', async () => {
    const user = {
      id: 1,
      email: 'test@test.com',
      password: 'password',
      fullName: 'full name',
    };
    const stub = sinon.stub(UserModel, 'findAll').resolves(user as any);
    const stubCreate = sinon.stub(UserModel, 'create').rejects();
    try {
      const usercreated = await userService.createUser({
        email: 'test@test.com',
        password: 'password',
        fullName: 'full name',
      });
      console.log(usercreated);
    } catch (error) {
      if (error instanceof HttpException) {
        expect(error.status).to.eql(123123);
        expect(error.message).to.eql('Email already in use');
      }
    }
    stub.restore();
    stubCreate.restore();
  });
  // it('Test createUSer for wrong password', async () => {
  //   const user = {
  //     id: 1,
  //     fullNAme: 'name',
  //     email: 'user@email.com',
  //     password: 'cryptopassword',
  //   };
  //   const stub = sinon.stub(UserModel, 'findOne').resolves(user as any);
  //   try {
  //     await loginService.login({ email: 'user@email.com', password: 'password' });
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       expect(error.status).to.eql(HttpStatusCode.UNAUTHORIZED);
  //       expect(error.message).to.eql('Invalid credentials');
  //     }
  //   }
  //   stub.restore();
  // });
  // it('Test createUSer for correct credentials', async () => {
  //   const salt = bcrypt.genSaltSync(10);
  //   // eslint-disable-next-line no-param-reassign
  //   const hashPassword = bcrypt.hashSync('password', salt);

  //   const user = {
  //     id: 1,
  //     fullNAme: 'name',
  //     email: 'user@email.com',
  //     password: hashPassword,
  //   };
  //   const stub = sinon.stub(UserModel, 'findOne').resolves(user as any);
  //   const response = await loginService.login({ email: 'user@email.com', password: 'password' });
  //   expect(response).to.eql({ id: 1, email: 'user@email.com' });
  //   stub.restore();
  // });
});
