export default interface ITrade {
  userId: number,
  stockSymbol: string,
  quantity: number,
  value: number,
  createdAt: Date,
  updatedAt: Date,
}
