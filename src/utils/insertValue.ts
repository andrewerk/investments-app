import IPortfolio from '../interfaces/Portfolio';
import stockApiService from '../services/stockApiService';

const insertValue = async (portfolio: IPortfolio[]) => {
  const portfolioWithValue = Promise.all(portfolio.map(async (asset: IPortfolio) => {
    const value = await stockApiService.getStock(asset.stockSymbol);
    const { stockSymbol, quantity } = asset;
    return { stockSymbol, quantity, currentValue: value.currentValue };
  }));
  console.log(portfolioWithValue);
  return portfolioWithValue;
};

export default insertValue;
