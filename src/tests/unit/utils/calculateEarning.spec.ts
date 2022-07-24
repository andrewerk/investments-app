import { expect } from 'chai';
import calculateEarnings from '../../../utils/calculateEarning';

describe('Test calculate earnings function', async () => {
  const tradeArray = [
    {
      id: 1,
      portfolioId: 1,
      quantity: 3,
      type: 'buy',
      value: 100,
      portfolio: {
        symbol: 'string',
      },
    },
    {
      id: 1,
      portfolioId: 1,
      quantity: 3,
      type: 'buy',
      value: 150,
      portfolio: {
        symbol: 'string',
      },
    },
    {
      id: 1,
      portfolioId: 1,
      quantity: 1,
      type: 'sell',
      value: 170,
      portfolio: {
        symbol: 'string',
      },
    },
  ];
  const portfolioObject = {
    id: 1,
    stockSymbol: 'string',
    quantity: 5,
    currentValue: 170,
  };

  it('Verify if function is doing the right count', () => {
    const result = calculateEarnings(portfolioObject, tradeArray);
    expect(result).to.eql(270);
  });
});
