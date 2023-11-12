export interface User {
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
}

export interface ResponseUser {
  id: number;
  email: string;
  userType: string;
}

export interface UserInput {
  id: number;
  uid: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
}

export interface PasswordCombo {
  hash: string;
  salt: string;
}
