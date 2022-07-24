import IPortfolio from '../interfaces/Portfolio';
import ITrade from '../interfaces/Trade';

const calculateEarnings = (asset: IPortfolio, history: ITrade[]): number => {
  const totalInTransactions = history.reduce((prev: number, current: ITrade) => {
    if (current.type === 'buy') {
      return prev - current.value * current.quantity;
    }
    return prev + current.value * current.quantity;
  }, 0);
  let totalInAssets = 0;
  if (asset.currentValue) {
    totalInAssets = asset.currentValue * asset.quantity;
  }
  return totalInAssets + totalInTransactions;
};

export default calculateEarnings;
