import {
  Table, Model, Column, DataType, PrimaryKey,
} from 'sequelize-typescript';
import { StockAvailability } from '../interfaces/Stock';

@Table({
  timestamps: true,
  tableName: 'Stocks',
})
export default class StockModel extends Model<StockAvailability> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    symbol!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    stockQuantity!: number;
}
