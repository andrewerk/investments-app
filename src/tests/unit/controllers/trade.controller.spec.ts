import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../../../app';
import HttpStatusCode from '../../../utils/http.status.code';
import tradeService from '../../../services/tradeService';
import userService from '../../../services/userService';

describe('Test trades controller', () => {
  let token: string;
  const portfolioRegisters = [{
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
  it('Test getTradeByUser', async () => {
    sinon.stub(tradeService, 'getTrades').resolves(portfolioRegisters as any);
    const response = await request(app)
      .get('/investments')
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql(portfolioRegisters);
  });
  it('Test getTradeByType', async () => {
    sinon.stub(tradeService, 'getTradesByType').resolves(portfolioRegisters as any);
    const response = await request(app)
      .get('/investments/user/buy')
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql(portfolioRegisters);
  });
  const portfolioItem = {
    id: 1,
    stockSymbol: 'string',
    quantity: 10,
  };
  const tradeItem = {
    symbol: 'string',
    quantity: 5,
  };
  it('Test buyStocks without sending data', async () => {
    sinon.stub(tradeService, 'buyStock').resolves(portfolioItem as any);
    const response = await request(app)
      .post('/investments/buy')
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.BAD_REQUEST);
    expect(response.body.message).to.eql('"symbol" is required');
  });
  it('Test buyStocks sending wrong data', async () => {
    sinon.stub(tradeService, 'buyStock').resolves(portfolioItem as any);
    const response = await request(app)
      .post('/investments/buy')
      .send({ symbol: 1, quantity: 5 })
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.UNPROCESSABLE_ENTITY);
    expect(response.body.message).to.eql('"symbol" must be a string');
  });
  it('Test buyStocks', async () => {
    sinon.stub(tradeService, 'buyStock').resolves(portfolioItem as any);
    const response = await request(app)
      .post('/investments/buy')
      .send(tradeItem)
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql(portfolioItem);
  });
  it('Test sellStocks', async () => {
    sinon.stub(tradeService, 'sellStock').resolves(portfolioItem as any);
    const response = await request(app)
      .post('/investments/sell')
      .send(tradeItem)
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql(portfolioItem);
  });
});
