import sinon from 'sinon';
import { expect } from 'chai';
import HttpException from '../../../utils/http.exception';
import HttpStatusCode from '../../../utils/http.status.code';
import InvestmentsPortfolioModel from '../../../models/InvestmentsPortfolioModel';
import investmentsPortfolioService from '../../../services/investmentsPortfolioService';
import stockApiService from '../../../services/stockApiService';

describe('Test portfolio service', () => {
  afterEach(() => sinon.restore());
  const assetReturn = {
    id: 1,
    userId: 1,
    stockSymbol: 'string',
    quantity: 100,
  };
  const { userId, stockSymbol, quantity } = assetReturn;
  it('Test buy new asset', async () => {
    sinon.stub(InvestmentsPortfolioModel, 'findOrCreate').resolves([assetReturn as any, true]);
    const asset = await investmentsPortfolioService.buy(userId, stockSymbol, quantity, null);
    expect(asset).to.eql({ id: asset.id, stockSymbol, quantity });
  });
  // it('Test buy more assets of a stock customer already has', async () => {
  //   sinon.stub(InvestmentsPortfolioModel, 'findOrCreate').resolves([assetReturn as any, false]);
  //   sinon.stub(InvestmentsPortfolioModel, 'update');
  //   const asset = await investmentsPortfolioService.buy(userId, stockSymbol, quantity, null);
  //   expect(asset).to.eql({ id: asset.id, stockSymbol, quantity: quantity * 2 });
  // });
  // it('Test sell asset successfully', async () => {
  //   sinon.stub(InvestmentsPortfolioModel, 'findOne').resolves(assetReturn as any);
  //   sinon.stub(InvestmentsPortfolioModel, 'update');
  //   const asset = await investmentsPortfolioService.sell(userId, stockSymbol, quantity, null);
  //   expect(asset).to.eql({ id: asset.id, stockSymbol, quantity: 0 });
  // });
  it('Test sell asset without having any of the stock', async () => {
    sinon.stub(InvestmentsPortfolioModel, 'findOne').resolves(null);
    try {
      await investmentsPortfolioService.sell(userId, stockSymbol, quantity, null);
    } catch (error) {
      if (error instanceof HttpException) {
        expect(error.status).to.eql(HttpStatusCode.CONFLICT);
        expect(error.message).to.eql('Customer does not owns any of these assets');
      }
    }
  });
  it('Test sell asset without having enough to sell', async () => {
    sinon.stub(InvestmentsPortfolioModel, 'findOne').resolves(assetReturn as any);
    try {
      await investmentsPortfolioService.sell(userId, stockSymbol, quantity + 1, null);
    } catch (error) {
      if (error instanceof HttpException) {
        expect(error.status).to.eql(HttpStatusCode.CONFLICT);
        expect(error.message).to.eql(`Assets available to sell: ${quantity}`);
      }
    }
  });
  it('Test getAssetsByCustomer', async () => {
    const stock = {
      stock: 'string',
      currentValue: 100,
      stockQuantity: 100,
    };
    const portfolioObject = {
      id: 1,
      stockSymbol,
      quantity,
      currentValue: 100,
    };
    sinon.stub(InvestmentsPortfolioModel, 'findAll').resolves([assetReturn] as any);
    sinon.stub(stockApiService, 'getStock').resolves(stock);
    const asset = await investmentsPortfolioService.getAssetsByCustomer(userId);
    expect(asset).to.eql([portfolioObject]);
  });
  it('Test getAssetByCustomerHistory', async () => {
    const stock = {
      id: 1,
      stock: 'string',
      currentValue: 100,
      stockQuantity: 100,
    };
    const portfolioObject = {
      id: 1,
      stockSymbol,
      quantity,
      currentValue: 100,
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
    sinon.stub(InvestmentsPortfolioModel, 'findOne').resolves(portfolioObject as any);
    sinon.stub(stockApiService, 'getStock').resolves(stock);
    const asset = await investmentsPortfolioService.getAssetByCustomerHistory(userId, stockSymbol);
    expect(asset).to.eql(portfolioObject);
  });
  it('Tests get getAssetByCustomerHistory for an asset that customer never had', async () => {
    sinon.stub(InvestmentsPortfolioModel, 'findAll').resolves(null as any);
    try {
      await investmentsPortfolioService.getAssetByCustomerHistory(userId, 'anyString');
    } catch (error) {
      if (error instanceof HttpException) {
        expect(error.status).to.eql(HttpStatusCode.NOT_FOUND);
        expect(error.message).to.eql('No assets found');
      }
    }
  });
});
