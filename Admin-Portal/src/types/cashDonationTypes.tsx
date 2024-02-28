export interface AddCashDonationType {
  organizationId: number;
  date: Date;
  total: number;
}

export interface CashDonation {
  id: number;
  date: Date;
  total: number;
  Organization: {
    name: string;
  };
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
