import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../../../app';
import accountService from '../../../services/accountService';
import HttpStatusCode from '../../../utils/http.status.code';
import userService from '../../../services/userService';

describe('Test account controller', async () => {
  let token: string;
  beforeEach(async () => {
    const user = {
      id: 1,
      email: 'test@test.com',
    };
    const createUser = {
      email: 'test@test.com',
      password: 'password',
      fullName: 'name',
    };
    sinon.stub(userService, 'createUser').resolves(user);
    const userCreated = await request(app)
      .post('/users')
      .send(createUser);
    token = userCreated.body;
  });
  afterEach(async () => {
    sinon.restore();
  });

  it('Test any operation without sending token', async () => {
    const response = await request(app)
      .post('/account');
    expect(response.status).to.eql(HttpStatusCode.UNAUTHORIZED);
    expect(response.body.message).to.eql('Token not found');
  });
  it('Test any operation sending wrong token', async () => {
    const response = await request(app)
      .post('/account')
      .set({ authorization: 'anyString' });
    expect(response.status).to.eql(HttpStatusCode.UNAUTHORIZED);
    expect(response.body.message).to.eql('Invalid token');
  });
  it('Test if it is possible to see account balance', async () => {
    sinon.stub(accountService, 'getById').resolves({ fullName: 'test', balance: 1000 });
    const response = await request(app)
      .get('/account')
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql({ fullName: 'test', balance: 1000 });
  });
  it('Test deposit feature', async () => {
    sinon.stub(accountService, 'deposit').resolves({ fullName: 'test', balance: 10 });
    const response = await request(app)
      .post('/account/deposit')
      .send({ value: 10 })
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql({ fullName: 'test', balance: 10 });
  });
  it('Test withdraw feature', async () => {
    sinon.stub(accountService, 'withdraw').resolves({ fullName: 'test', balance: 10 });
    const response = await request(app)
      .post('/account/withdraw')
      .send({ value: 10 })
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql({ fullName: 'test', balance: 10 });
  });
});
