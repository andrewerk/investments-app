export default interface ITrade {
  userId: number,
  stockSymbol: string,
  quantity: number,
  value: number,
  type: string
  createdAt?: Date,
  updatedAt?: Date,
}
