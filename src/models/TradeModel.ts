/* eslint-disable import/no-cycle */
import {
  Table, Model, Column, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import ITrade from '../interfaces/Trade';
import InvestmentsPortfoliotModel from './InvestmentsPortfolioModel';

@Table({
  timestamps: true,
  tableName: 'Trades',
})
export default class TradeModel extends Model<ITrade> {
  @ForeignKey(() => InvestmentsPortfoliotModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    portfolioId!: number;

  @BelongsTo(() => InvestmentsPortfoliotModel)
    portfolio!: InvestmentsPortfoliotModel;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    quantity!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    type!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
    value!: number;
}
