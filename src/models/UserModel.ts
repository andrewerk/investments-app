/* eslint-disable import/no-cycle */
import {
  Table, Model, Column, DataType, BeforeCreate, HasMany,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/User';
import InvestmentsPortfoliotModel from './InvestmentsPortfolioModel';

@Table({
  timestamps: false,
  tableName: 'Users',
})
export default class UserModel extends Model<IUser> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    fullName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
    email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    password!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
    balance!: number;

  @HasMany(() => InvestmentsPortfoliotModel)
    portfolios!: InvestmentsPortfoliotModel[];

  @BeforeCreate
  static async encryptPassword(instance: UserModel) {
    const salt = bcrypt.genSaltSync(10);
    // eslint-disable-next-line no-param-reassign
    instance.password = bcrypt.hashSync(instance.password, salt);
  }
}
