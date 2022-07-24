import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../../../app';
import HttpStatusCode from '../../../utils/http.status.code';
import investmentsPortfolioService from '../../../services/investmentsPortfolioService';
import userService from '../../../services/userService';

describe('Test portfolio controller', () => {
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
    token = userCreated.body.token;
  });
  afterEach(async () => {
    sinon.restore();
  });
  it('Test getAssetsByCustomer', async () => {
    const portfolioObject = [{
      stockSymbol: 'string',
      quantity: 10,
      currentvalue: 100,
    }];
    sinon.stub(investmentsPortfolioService, 'getAssetsByCustomer').resolves(portfolioObject);
    const response = await request(app)
      .get('/assets')
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql(portfolioObject);
  });
  it('Test getAssetByCustomerHistory', async () => {
    const portfolioObject = [{
      stockSymbol: 'string',
      quantity: 10,
      currentvalue: 100,
      trades: [
        {
          id: 1,
          portfolioId: 1,
          quantity: 2,
          type: 'buy',
          value: 100,
        },
      ],
    }];
    sinon.stub(investmentsPortfolioService, 'getAssetByCustomerHistory').resolves(portfolioObject as any);
    const response = await request(app)
      .get('/assets/string')
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql(portfolioObject);
  });
  it('Test earnings by stock', async () => {
    sinon.stub(investmentsPortfolioService, 'getEarningByStock').resolves(10);
    const response = await request(app)
      .get('/account/earnings/string')
      .set({ authorization: token });
    expect(response.body.earnings).to.eql(10);
  });
  it('Test earnings by stock', async () => {
    sinon.stub(investmentsPortfolioService, 'getTotalEarnings').resolves(10);
    const response = await request(app)
      .get('/account/earnings/')
      .set({ authorization: token });
    expect(response.body.earnings).to.eql(10);
  });
});
