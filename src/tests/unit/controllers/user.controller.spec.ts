import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../../../app';
import userService from '../../../services/userService';
import HttpStatusCode from '../../../utils/http.status.code';

describe('Test user controller', () => {
  it('Test create user without sending data', async () => {
    const response = await request(app)
      .post('/users')
      .send({});
    expect(response.status).to.eql(HttpStatusCode.BAD_REQUEST);
  });
  it('Test create user sending incorrect email format', async () => {
    const response = await request(app)
      .post('/users')
      .send(
        {
          email: 'incorretEmailFormat',
          password: 'password',
          fullName: 'full name',
        },
      );
    expect(response.status).to.eql(HttpStatusCode.UNPROCESSABLE_ENTITY);
  });
  it('Test create user sending short password', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'test@test.com',
        password: 'short',
        fullName: 'full name',
      });
    expect(response.status).to.eql(HttpStatusCode.UNPROCESSABLE_ENTITY);
  });
  it('Test create user successfuly', async () => {
    const objectStub = {
      id: 1,
      email: 'teste@teste.com',
    };
    const stub = sinon.stub(userService, 'createUser').resolves(objectStub);
    const response = await request(app)
      .post('/users')
      .send({
        email: 'test@test.com',
        password: 'password',
        fullName: 'full name',
      });
    expect(response.status).to.eql(HttpStatusCode.CREATED);
    expect(response.body).to.be.a('string');
    stub.restore();
  });
});
