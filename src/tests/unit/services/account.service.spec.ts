import sinon from 'sinon';
import { expect } from 'chai';
import UserModel from '../../../models/UserModel';
import HttpException from '../../../utils/http.exception';
import HttpStatusCode from '../../../utils/http.status.code';
import accountService from '../../../services/accountService';

describe('Test account service', () => {
  afterEach(() => sinon.restore());
  const userReturn = {
    id: 1,
    email: 'test@test.com',
    password: 'password',
    fullName: 'full name',
    balance: 100,
  };
  it('Test get by id', async () => {
    sinon.stub(UserModel, 'findByPk').resolves(userReturn as any);
    const user = await accountService.getById(1);
    expect(user).to.eql({ fullName: userReturn.fullName, balance: userReturn.balance });
  });
  it('Test deposit feature', async () => {
    sinon.stub(UserModel, 'findByPk').resolves(UserModel as any);
    sinon.stub(UserModel, 'update').resolves(userReturn as any);
    const user = await accountService.deposit(1, 100, null);
    expect(user).to.eql({ fullName: userReturn.fullName, balance: 100 });
  });
  it('Test withdraw feature when there is not enough funds', async () => {
    sinon.stub(UserModel, 'findByPk').resolves(userReturn as any);
    sinon.stub(UserModel, 'update');
    const value = 101;
    try {
      await accountService.withdraw(userReturn.id, value, null);
    } catch (error) {
      if (error instanceof HttpException) {
        expect(error.status).to.eql(HttpStatusCode.CONFLICT);
        expect(error.message).to.eql('Not possible to proceed with withdraw or sell. Not enough funds');
      }
    }
  });
  it('Test withdraw feature', async () => {
    sinon.stub(UserModel, 'findByPk').resolves(userReturn as any);
    sinon.stub(UserModel, 'update');
    const value = 50;
    const user = await accountService.withdraw(userReturn.id, value, null);
    expect(user).to.eql({ fullName: userReturn.fullName, balance: userReturn.balance - value });
  });
});
