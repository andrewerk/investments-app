import {
  Table, Model, Column, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import StockModel from './StockModel';
import UserModel from './UserModel';

@Table({
  timestamps: true,
  tableName: 'InvestmentsPortfolio',
})
export default class InvestmentsPortfoliotModel extends Model {
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
}
