import {
  Table, Model, Column, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import StockModel from './StockModel';
// import Stock from '../interfaces/Stock';
import UserModel from './UserModel';

@Table({
  timestamps: true,
  tableName: 'Trades',
})
export default class TradeModel extends Model {
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

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
    value!: number;
}
