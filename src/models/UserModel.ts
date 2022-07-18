import { Table, Model, Column, DataType, BeforeCreate, BeforeFind } from "sequelize-typescript";
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

  @BeforeCreate
  static async encryptPassword(instance: UserModel) {
    const salt = await bcrypt.genSaltSync(10)
    instance.password = bcrypt.hashSync(instance.password, salt)
  }
}