export interface IUserData {
  email: string,
}

export interface IUserAdd extends IUserData {
  fullName: string,
  password: string
}

export interface IUserToken extends IUserData {
  id?: number,
}

export interface IUser extends IUserAdd, IUserData, IUserToken {}