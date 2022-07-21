import sinon from 'sinon';
import { expect } from 'chai';
import { curly } from 'node-libcurl';
import HttpException from '../../../utils/http.exception';
import HttpStatusCode from '../../../utils/http.status.code';
import stockApiService from '../../../services/stockApiService';
import stockService from '../../../services/stockService';
import StockModel from '../../../models/StockModel';

describe('Test internal and external stock service', () => {
  afterEach(() => sinon.restore());
  describe('Test stockApiService', () => {
    const data = {
      c: 153.04,
      d: 2.04,
      dp: 1.351,
      h: 153.72,
      l: 150.37,
      o: 151.12,
      pc: 151,
      t: 1658347204,
    };

    const dataNotFound = {
      c: 0,
      d: null,
      dp: null,
      h: 0,
      l: 0,
      o: 0,
      pc: 0,
      t: 0,
    };
    const stock = 'string';
    const stockQuantity = 100;
    const toManyRequests = '{"error":"API limit reached. Please try again later. Remaining Limit: 0"}';
    it('Test getStock in case of success', async () => {
      sinon.stub(curly, 'get').resolves({ statusCode: 200, data } as any);
      sinon.stub(stockService, 'getQuantity').resolves(100);
      const stockReturn = await stockApiService.getStock(stock);
      expect(stockReturn).to.eql({ stock, stockQuantity, currentValue: data.c });
    });
    it('Test getStock in case of too many requests', async () => {
      sinon.stub(curly, 'get').resolves({ statusCode: HttpStatusCode.TO_MANY_REQUESTS, data: toManyRequests } as any);
      try {
        await stockApiService.getStock(stock);
      } catch (error) {
        if (error instanceof HttpException) {
          expect(error.status).to.eql(HttpStatusCode.TO_MANY_REQUESTS);
          expect(error.message).to.eql('To many requests to external API. Wait one minute');
        }
      }
    });
    it('Test getStock in case of non stock found', async () => {
      sinon.stub(curly, 'get').resolves({ statusCode: HttpStatusCode.NOT_FOUND, data: dataNotFound } as any);
      try {
        await stockApiService.getStock(stock);
      } catch (error) {
        if (error instanceof HttpException) {
          expect(error.status).to.eql(HttpStatusCode.NOT_FOUND);
          expect(error.message).to.eql('Stock not found');
        }
      }
    });
    it('Test listPopularStocks', async () => {
      const stockObject = {
        stock: 'string',
        stockQuantity: 10,
        currentValue: 100,
      };
      sinon.stub(Promise, 'all').resolves([stockObject]);
      const stocksReturn = await stockApiService.listPopularStocks();
      expect(stocksReturn).to.eql([stockObject]);
    });
  });
  describe('Test stockService', () => {
    const returnStock = {
      symbol: 'string',
      stockQuantity: 10,
    };
    beforeEach(() => {
      sinon.stub(StockModel, 'findByPk').resolves(returnStock as any);
    });
    afterEach(() => sinon.restore());
    it('Test sale function in case of success', async () => {
      sinon.stub(StockModel, 'update');
      const assetsAvailable = await stockService.sale('string', 5, null);
      expect(assetsAvailable).to.eql(15);
    });
    it('Test buy function in case of succes', async () => {
      sinon.stub(StockModel, 'update');
      const assetsAvailable = await stockService.buy('string', 5, null);
      expect(assetsAvailable).to.eql(5);
    });
    it('Test buy function in case of failure', async () => {
      try {
        await stockService.buy('string', returnStock.stockQuantity + 1, null);
      } catch (error) {
        if (error instanceof HttpException) {
          expect(error.status).to.eql(HttpStatusCode.CONFLICT);
          expect(error.message).to.eql(`Only ${returnStock.stockQuantity} are available to sell`);
        }
      }
    });
  });
});
