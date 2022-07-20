export interface IUserData {
  email: string,
}

export interface IUserAdd extends IUserData {
  fullName: string,
  password: string,
  balance?: number
}

export interface IUserToken extends IUserData {
  id?: number,
}

export interface IUserLogin extends IUserData {
  password: string
}

export interface IUser extends IUserAdd, IUserData, IUserToken {}
