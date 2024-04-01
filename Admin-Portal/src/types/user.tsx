export interface ResponseUser {
  id: number;
  email: string;
  userType: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zip: number;
  state: string;
  Organization: {
    name: string;
  };
  status: string;
}

export interface AddUserType {
  email: string;
  userType: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zip: number;
  state: string;
  organizationId: number;
  status: string;
  password: string;
}

export interface UserDashboardResponse {
  totalNumber: number;
  users: ResponseUser[];
}

export type UserRow = {
  id: number;
  email: string;
  type: string;
  name: string;
  phone: string;
  address: string;
  organization: string;
  status: string;
};

export type EditUserType = {
  id: number;
  email?: string;
  userType?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: number;
  state?: string;
  organizationId?: number;
  status?: string;
};

export type EditUserArgs = {
  id: number;
  userData: EditUserType;
  token: string;
};
