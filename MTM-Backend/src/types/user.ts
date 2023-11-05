export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface ResponseUser {
  id: number;
  email: string;
}

export interface UserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface PasswordCombo {
  hash: string;
  salt: string;
}
