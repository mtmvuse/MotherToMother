export interface ResponseAdmin {
  id: number;
  email: string;
  role: string;
  name: string;
}

export interface AddAdminType {
  email: string;
  role: string;
  name: string;
}

export interface AdminDashboardResponse {
  totalNumber: number;
  admins: ResponseAdmin[];
}

export type AdminRow = {
  id: number;
  email: string;
  role: string;
  name: string;
};

export type EditAdminType = {
  id: number;
  email?: string;
  role?: string;
  name?: string;
};

export type EditAdminArgs = {
  id: number;
  adminData: EditAdminType;
};
