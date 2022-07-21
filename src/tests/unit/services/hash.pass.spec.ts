import sinon from 'sinon';
import bcrypt from 'bcrypt';
import { expect } from 'chai';
import UserModel from '../../../models/UserModel';

describe('Test hashing password', async () => {
  sinon.stub(bcrypt, 'genSaltSync');
  sinon.stub(bcrypt, 'hashSync').resolves('hashPass');
  const hashPass = await UserModel.encryptPassword(new UserModel());
  expect(hashPass).to.eql('hashPass');
});

// Verificar teste novamente. Nao esta sendo listado;
