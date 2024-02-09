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
}

export interface UserDashboardResponse {
  totalNumber: number;
  users: ResponseUser[];
}

export type EditUserType = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: number;
};

export type EditUserArgs = {
  email: string;
  userData: EditUserType;
  token: string;
};
