import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../../../app';
import HttpStatusCode from '../../../utils/http.status.code';
import userService from '../../../services/userService';

describe('Test notFound controller', async () => {
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

  it('Test any requisition for a unexisting endpoint', async () => {
    const response = await request(app)
      .post('/*')
      .set({ authorization: token });
    expect(response.status).to.eql(HttpStatusCode.NOT_FOUND);
    expect(response.body.message).to.eql('Not Found');
  });
});
