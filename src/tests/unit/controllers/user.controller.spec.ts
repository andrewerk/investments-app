import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../../../app';
import userService from '../../../services/userService';
import HttpStatusCode from '../../../utils/http.status.code';

describe('Test user controller', () => {
  describe('Test create user function', () => {
    afterEach(() => sinon.restore());
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
      sinon.stub(userService, 'createUser').resolves(objectStub);
      const response = await request(app)
        .post('/users')
        .send({
          email: 'test@test.com',
          password: 'password',
          fullName: 'full name',
        });
      expect(response.status).to.eql(HttpStatusCode.CREATED);
      expect(response.body.token).to.be.a('string');
    });
  });
  describe('Test update functions', () => {
    let token:string;
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
    it('Test update user without sending any body', async () => {
      const response = await request(app)
        .patch('/users')
        .set({ authorization: token });
      expect(response.status).to.eql(422);
    });
    it('Test update user successfully', async () => {
      sinon.stub(userService, 'updateUser').resolves({ fullName: 'User', email: 'test@test.com' });
      const response = await request(app)
        .patch('/users')
        .send({ fullName: 'User' })
        .set({ authorization: token });
      expect(response.status).to.eql(200);
      expect(response.body).to.eql({ updatedUser: { fullName: 'User', email: 'test@test.com' } });
    });
    it('Test update password without sending any body', async () => {
      const response = await request(app)
        .patch('/users/pass')
        .set({ authorization: token });
      expect(response.status).to.eql(400);
    });
    it('Test update password successfully', async () => {
      sinon.stub(userService, 'changePassword');
      const response = await request(app)
        .patch('/users/pass')
        .send({ password: 'password' })
        .set({ authorization: token });
      expect(response.status).to.eql(204);
    });
  });
});
