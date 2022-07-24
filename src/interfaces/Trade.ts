export default interface ITrade {
  portfolioId?: number,
  quantity: number,
  symbol?: string,
  value: number,
  type: string
  createdAt?: Date,
}
