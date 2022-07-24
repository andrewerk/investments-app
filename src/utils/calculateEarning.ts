import IPortfolio from '../interfaces/Portfolio';
import ITrade from '../interfaces/Trade';

const calculateEarnings = (asset: IPortfolio, history: ITrade[]): number => {
  const totalInTransactions = history.reduce((prev: number, current: ITrade) => {
    if (current.type === 'buy') {
      return prev - current.value * current.quantity;
    }
    return prev + current.value * current.quantity;
  }, 0);
  const totalInAssets = asset.currentValue as number * asset.quantity;
  return totalInAssets + totalInTransactions;
};

export default calculateEarnings;
