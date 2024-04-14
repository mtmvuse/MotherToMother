export interface ResponseCashDonation {
  id: number;
  date?: Date;
  total?: number;
  userId?: number;
}

export interface CashDonationInput {
  id: number;
  date: Date;
  total: number;
  userId: number;
  currentUser?: string;
}

export interface APQueryType {
  page: number;
  pageSize: number;
  id: number;
  sort: string;
  order: string;
  date: Date;
  total: number;
}

export interface cdDashboardDisplay {
  id: number;
  firstName: string;
  lastName: string;
  organization: string;
  date: Date;
  total: number;
}
