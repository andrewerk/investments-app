export default interface ITrade {
  portfolioId?: number,
  quantity: number,
  value: number,
  type: string
  createdAt?: Date,
  updatedAt?: Date,
}
