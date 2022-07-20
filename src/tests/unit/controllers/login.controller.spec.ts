import request from 'supertest';
import { expect } from 'chai';
import app from '../../../app';

describe('Test login controller', () => {
  it('Test login without sending data', async () => {
    const response = await request(app)
      .post('/login')
      .send({});
    expect(response.status).to.eql(400);
  });
  it('Test login sending incorrect data', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'incorretEmailFormat', password: 'short' });
    expect(response.status).to.eql(422);
  });
  it('Test login sending correct data for no user exists', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'teste@teste.com', password: 'newpassword' });
    expect(response.status).to.eql(401);
  });
  it('Test login successful', async () => {
    await request(app)
      .post('/users')
      .send({
        fullName: 'new name',
        email: 'newteste@teste.com',
        password: 'mynewpass',
      });
    const response = await request(app)
      .post('/login')
      .send({ email: 'newteste@teste.com', password: 'mynewpass' });
    expect(response.status).to.eql(200);
  });
});
