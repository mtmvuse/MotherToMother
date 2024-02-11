export interface DonationType {
  id: number;
  userId: number;
  date: Date;
}

export interface DonationDetailType {
  id: number;
  itemId: number;
  item?: string;
  category?: string;
  donationId: number;
  usedQuantity: number;
  newQuantity: number;
}

export interface OutgoingDonationRequestBodyType {
  userId: number;
  email: string;
  numberServed: number;
  whiteNum: number;
  latinoNum: number;
  blackNum: number;
  nativeNum: number;
  asianNum: number;
  otherNum: number;
  donationDetails: Array<DonationDetailType>;
}

export interface OutgoingDonationStatsType {
  id: number;
  donationId: number;
  numberServed: number;
  whiteNum: number;
  latinoNum: number;
  blackNum: number;
  nativeNum: number;
  asianNum: number;
  otherNum: number;
}

export interface DashboardDonationDetailType {
  itemId: number;
  item: string;
  status: string;
  value: number;
  quantity: number;
  total: number;
}

export interface ProductType {
  name: string;
  quantity: number;
}

export interface IncomingDonationRequestBodyType {
  userId: number;
  products: Array<ProductType>;
}
