export interface ResponseCashDonation {
  id: number;
  date: Date;
  total: number;
  organization?: string;
}

export interface CashDonationInput {
  id: number;
  date: Date;
  total: number;
  organization?: string;
  organizationId: number;
}

export interface AddCashDonationType {
  date: Date;
  total: number;
  organizationId: number;
}
