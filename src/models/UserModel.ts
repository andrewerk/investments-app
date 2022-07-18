import { Table, Model, Column, DataType, BeforeCreate } from "sequelize-typescript";
import bcrypt from 'bcrypt';
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

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  balance!: number;

  @BeforeCreate
  static async encryptPassword(instance: UserModel) {
    const salt = bcrypt.genSaltSync(10)
    instance.password = bcrypt.hashSync(instance.password, salt)
  }
}