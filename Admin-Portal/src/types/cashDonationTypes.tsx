export interface AddCashDonationType {
  userId: number;
  date: Date;
  total: number;
}

export type CashDonationRow = {
  id: number;
  date: Date;
  total: number;
  firstName: string;
  lastName: string;
  userId: number;
  organization: string;
};

export type EditCashType = {
  id: number;
  date?: Date;
  total?: number;
  userId?: number;
};

export type EditCashArgs = {
  id: number;
  cashData: EditCashType;
  token: string;
};

export interface cdDashboardResponse {
  totalNumber: number;
  cashDonation: CashDonationRow[];
}

export interface CDUser {
  id: number;
  firstName: string;
  lastName: string;
}
