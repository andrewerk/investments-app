import sinon from 'sinon';
import { expect } from 'chai';
import randomQuantity from '../../../utils/randomQuantity';

describe('Teste generate random quantity function', () => {
  it('Tests if function return value as expected', () => {
    sinon.stub(Math, 'random').returns(0.5);
    const result = randomQuantity.generateRandomQuantity(100);
    expect(result).to.eql(50);
  });
});
