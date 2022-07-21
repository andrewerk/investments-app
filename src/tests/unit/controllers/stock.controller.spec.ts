import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../../../app';
import HttpStatusCode from '../../../utils/http.status.code';
import stockApiService from '../../../services/stockApiService';
import userService from '../../../services/userService';

describe('Test stock controller', () => {
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
  it('Test listStocks', async () => {
    const stockObject = {
      stock: 'string',
      stockQuantity: 10,
      currentValue: 100,
    };
    sinon.stub(stockApiService, 'listPopularStocks').resolves([stockObject]);
    const response = await request(app)
      .get('/stocks')
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql([stockObject]);
  });
  it('Test getBySymbol', async () => {
    const stockObject = {
      stock: 'string',
      stockQuantity: 10,
      currentValue: 100,
    };
    sinon.stub(stockApiService, 'getStock').resolves(stockObject);
    const response = await request(app)
      .get('/stocks/string')
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.OK);
    expect(response.body).to.eql(stockObject);
  });
});
