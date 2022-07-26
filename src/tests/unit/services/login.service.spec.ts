import sinon from 'sinon';
import { expect } from 'chai';
import bcrypt from 'bcrypt';
import UserModel from '../../../models/UserModel';
import loginService from '../../../services/loginService';
import HttpException from '../../../utils/http.exception';
import HttpStatusCode from '../../../utils/http.status.code';

describe('Test login service', () => {
  afterEach(() => sinon.restore());
  it('Test login for inexistent user', async () => {
    sinon.stub(UserModel, 'findOne').resolves(null);
    try {
      await loginService.login({ email: '', password: '' });
    } catch (error) {
      if (error instanceof HttpException) {
        expect(error.status).to.eql(HttpStatusCode.UNAUTHORIZED);
        expect(error.message).to.eql('Invalid credentials');
      }
    }
  });
  it('Test login for wrong password', async () => {
    const user = {
      id: 1,
      fullNAme: 'name',
      email: 'user@email.com',
      password: 'cryptopassword',
    };
    sinon.stub(UserModel, 'findOne').resolves(user as any);
    try {
      await loginService.login({ email: 'user@email.com', password: 'password' });
    } catch (error) {
      if (error instanceof HttpException) {
        expect(error.status).to.eql(HttpStatusCode.UNAUTHORIZED);
        expect(error.message).to.eql('Invalid credentials');
      }
    }
  });
  it('Test login for correct credentials', async () => {
    const salt = bcrypt.genSaltSync(10);
    // eslint-disable-next-line no-param-reassign
    const hashPassword = bcrypt.hashSync('password', salt);

    const user = {
      id: 1,
      fullNAme: 'name',
      email: 'user@email.com',
      password: hashPassword,
    };
    sinon.stub(UserModel, 'findOne').resolves(user as any);
    const response = await loginService.login({ email: 'user@email.com', password: 'password' });
    expect(response).to.eql({ id: 1, email: 'user@email.com' });
  });
});
