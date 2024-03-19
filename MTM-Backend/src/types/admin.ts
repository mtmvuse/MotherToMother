export interface AdminInputNoID {
  name: string;
  email: string;
  role: string;
}

export interface AdminType extends AdminInputNoID {
  id: number;
}
export interface Admin {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ResponseAdmin {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: number;
  state?: string;
}

export interface AdminInput {
  id: number;
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: number;
  role: string;
}

export interface RawAdminInput extends AdminInput {
  currentAdmin: string;
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

export interface AdminDashboardDisplay {
  id: number;
  role: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}
