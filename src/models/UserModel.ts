import { Table, Model, Column, DataType } from "sequelize-typescript";
import { IUserAdd } from '../interfaces/User';


@Table({
  timestamps: false,
  tableName: 'Users',
})
export default class UserModel extends Model<IUserAdd> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;
}