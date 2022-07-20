import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../../../app';
import loginService from '../../../services/loginService';
import HttpException from '../../../utils/http.exception';
import HttpStatusCode from '../../../utils/http.status.code';

describe('Test login controller', () => {
  afterEach(() => sinon.restore());
  it('Test login without sending data', async () => {
    const response = await request(app)
      .post('/login')
      .send({});
    expect(response.status).to.eql(400);
  });
  it('Test login sending incorrect email format', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'incorretEmailFormat', password: 'password' });
    expect(response.status).to.eql(422);
  });
  it('Test login sending short password', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@test.com', password: 'short' });
    expect(response.status).to.eql(422);
  });
  it('Test login sending invalid credentials', async () => {
    sinon.stub(loginService, 'login').throws(new HttpException(HttpStatusCode.UNAUTHORIZED, 'Invalid Credentials'));
    const response = await request(app)
      .post('/login')
      .send({ email: 'teste@teste.com', password: 'newpassword' });
    expect(response.status).to.eql(401);
    expect(response.body.message).to.eql('Invalid Credentials');
  });
  it('Test login successful', async () => {
    const objectStub = {
      id: 1,
      email: 'teste@teste.com',
    };
    sinon.stub(loginService, 'login').resolves(objectStub);
    const response = await request(app)
      .post('/login')
      .send({ email: 'teste@teste.com', password: 'mynewpass' });
    expect(response.status).to.eql(200);
    expect(response.body).to.be.a('string');
  });
});
