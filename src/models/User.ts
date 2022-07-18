import { Table, Model, Column, DataType } from "sequelize-typescript";
import { IUser } from '../interfaces/User';

@Table({
  timestamps: false,
  tableName: "Users",
})
export class User extends Model<IUser> {
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