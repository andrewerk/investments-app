export interface IUserData {
  fullName: string,
  email: string,
}

export interface IUserAdd extends IUserData {
  password: string
}

export interface IUserToken extends IUserData {
  id: number,
}

export interface IUser extends IUserAdd, IUserData, IUserToken {}