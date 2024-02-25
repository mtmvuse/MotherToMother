export interface AddCashDonationType {
  organizationId: number;
  date: Date;
  total: number;
}

export interface ResponseCashDonation {
  id: number;
  date: Date;
  total: number;
  organization: string;
}

export interface CashDashboardResponse {
  totalNumber: number;
  cashDonations: ResponseCashDonation[];
}
