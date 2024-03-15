export interface ResponseCashDonation {
  id: number;
  date?: Date;
  total?: number;
  organization?: string;
}

export interface CashDonationInput {
  id: number;
  date: Date;
  total: number;
  organizationId: number;
}

export interface APQueryType {
  page: number;
  pageSize: number;
  organization: string;
  id: number;
  sort: string;
  order: string;
  date: Date;
  total: number;
}

export interface cdDashboardDisplay {
  id: number;
  organization: string;
  date: Date;
  total: number;
}
