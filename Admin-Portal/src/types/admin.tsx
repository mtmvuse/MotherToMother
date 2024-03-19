export interface ResponseAdmin {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    zip: number;
    state: string;
  }
  
  export interface AddAdminType {
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    zip: number;
    state: string;
  }
  
  export interface AdminDashboardResponse {
    totalNumber: number;
    admin: ResponseAdmin[];
  }
  
  export type AdminRow = {
    id: number;
    email: string;
    role: string;
    name: string;
    phone: string;
    address: string;
  };
  
  export type EditAdminType = {
    id: number;
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    zip?: number;
    state?: string;
  };
  
  export type EditAdminArgs = {
    id: number;
    adminData: EditAdminType;
    token: string;
  };
  