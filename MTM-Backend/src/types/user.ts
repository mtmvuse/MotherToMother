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
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: number;
  state?: string;
  organizatioin?: string;
}

export interface UserInput {
  id: number;
  uid: string;
  organizationId: number;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: number;
  role: string;
  household: string;
  userType: string;
}

export interface RawUserInput extends UserInput {
  currentUser: string;
}

export interface PasswordCombo {
  hash: string;
  salt: string;
}

export interface APQueryType {
  page: number;
  pageSize: number;
  email: string;
  organization: string;
  type: string;
  id: number;
  address: string;
  phone: string;
  sort: string;
  order: string;
  name: string;
}

export interface UserDashboardDisplay {
  id: number;
  organization: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
}
