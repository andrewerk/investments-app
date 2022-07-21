import sinon from 'sinon';
import { expect } from 'chai';
import InvestmentsPortfolioModel from '../../../models/InvestmentsPortfolioModel';
import investmentsPortfolioService from '../../../services/investmentsPortfolioService';
import stockApiService from '../../../services/stockApiService';
import accountService from '../../../services/accountService';
import stockService from '../../../services/stockService';
import TradeModel from '../../../models/TradeModel';
import tradeService from '../../../services/tradeService';

describe('Test trade service', () => {
  describe('Test transactions', () => {
    const stock = {
      currentValue: 100,
      stock: 'string',
      stockQuantity: 20,
    };
    const portfolioItem = {
      id: 1,
      stockSymbol: 'string',
      quantity: 10,
    };
    const userId = 1;
    const stockSymbol = 'string';
    const quantity = 5;
    beforeEach(() => {
      sinon.stub(stockApiService, 'getStock').resolves(stock);
      sinon.stub(accountService, 'withdraw');
      sinon.stub(stockService, 'buy');
      sinon.stub(investmentsPortfolioService, 'buy').resolves(portfolioItem);
      sinon.stub(accountService, 'deposit');
      sinon.stub(stockService, 'sale');
      sinon.stub(investmentsPortfolioService, 'sale').resolves(portfolioItem);
      sinon.stub(TradeModel, 'create');
    });
    afterEach(() => sinon.restore());

    it('Tests buy stock function', async () => {
      const assets = await tradeService.buyStock(userId, stockSymbol, quantity);
      expect(assets).to.eql(portfolioItem);
    });
    it('Tests sell stock function', async () => {
      const assets = await tradeService.saleStock(userId, stockSymbol, quantity);
      expect(assets).to.eql(portfolioItem);
    });
  });
  describe('Test listing trades functions', () => {
    const tradeObject = {
      id: 1,
      stockSymbol: 'string',
      quantity: 3,
      trades: [
        {
          id: 1,
          portfolioId: 1,
          quantity: 2,
          type: 'buy',
          value: 100,
        },
      ],
    };
    beforeEach(() => {
      sinon.stub(InvestmentsPortfolioModel, 'findAll').resolves(tradeObject as any);
    });
    afterEach(() => sinon.restore());
    it('Test getTrades function', async () => {
      const trades = await tradeService.getTrades(1);
      expect(trades).to.eql(tradeObject);
    });
    it('Test getTradesByType function', async () => {
      const trades = await tradeService.getTradesByType(1, 'buy');
      expect(trades).to.eql(tradeObject);
    });
  });
});
