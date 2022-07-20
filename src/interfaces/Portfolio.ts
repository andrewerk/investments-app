import ITrade from './Trade';

export default interface IPortfolio {
  id?: number,
  userId?: number,
  stockSymbol: string,
  quantity: number,
  currentValue?: number,
  trades?: ITrade[]
}
