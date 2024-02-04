export interface Transaction {
  id: number;
  date: string;
  organization: string;
  total: number;
  items: number;
  type: string;
}

export interface TransactionDetail {
  item: string;
  status: string;
  value: number;
  quantity: number;
  total: number;
}
