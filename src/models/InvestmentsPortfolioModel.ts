/* eslint-disable import/no-cycle */
import {
  Table, Model, Column, DataType, ForeignKey, BelongsTo, Scopes, HasMany,
} from 'sequelize-typescript';
import StockModel from './StockModel';
import UserModel from './UserModel';
import IPortfolio from '../interfaces/Portfolio';
// eslint-disable-next-line import/no-cycle
import TradeModel from './TradeModel';

@Scopes(() => ({
  records: {
    include: [TradeModel.scope('portfolio')],
  },
}))
@Table({
  timestamps: false,
  tableName: 'InvestmentsPortfolio',
})
export default class InvestmentsPortfolioModel extends Model<IPortfolio> {
  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    userId!: number;

  @BelongsTo(() => UserModel)
    user!: UserModel;

  @ForeignKey(() => StockModel)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    stockSymbol!: string;

  @BelongsTo(() => StockModel)
    stock!: StockModel;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    quantity!: number;

  @HasMany(() => TradeModel)
    trades!: TradeModel[];
}
