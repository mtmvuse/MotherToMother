export interface AddCashDonationType {
  organizationId: number;
  date: Date;
  total: number;
}

export type CashDonationRow = {
  id: number;
  date: Date;
  total: number;
  organization: string;
};

export type EditCashType = {
  id: number;
  date?: Date;
  total?: number;
  organizationId?: number;
};

export type EditCashArgs = {
  id: number;
  cashData: EditCashType;
  token: string;
};

export interface cdDashboardResponse {
  totalNumber: number;
  cashDonation: ResponseCd[];
}

export interface ResponseCd {
  id: number;
  date: Date;
  total: number;
  Organization: {
    name: string;
  };
}
