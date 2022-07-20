import sinon from 'sinon';
import { expect } from 'chai';
import UserModel from '../../../models/UserModel';
import HttpException from '../../../utils/http.exception';
import HttpStatusCode from '../../../utils/http.status.code';
import userService from '../../../services/userService';

describe('Test createUser service', () => {
  afterEach(() => sinon.restore());
  const userReturn = {
    id: 1,
    email: 'test@test.com',
    password: 'password',
    fullName: 'full name',
  };
  const userCreate = {
    email: 'test@test.com',
    password: 'password',
    fullName: 'full name',
  };
  it('Test createUSer for existent user', async () => {
    sinon.stub(UserModel, 'findOrCreate').resolves([userReturn as any, false]);
    try {
      await userService.createUser(userCreate);
    } catch (error) {
      if (error instanceof HttpException) {
        expect(error.status).to.eql(HttpStatusCode.CONFLICT);
        expect(error.message).to.eql('Email already in use');
      }
    }
  });
  it('Test createUSer working properly', async () => {
    sinon.stub(UserModel, 'findOrCreate').resolves([userReturn as any, true]);

    const user = await userService.createUser(userCreate);

    expect(user).to.eql({ id: 1, email: 'test@test.com' });
  });
});
