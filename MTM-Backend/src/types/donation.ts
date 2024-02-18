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
  products: Array<ProductType>;
}

export interface IncomingDonationTypeWithID
  extends IncomingDonationRequestBodyType {
  userId: number;
}

export interface IncomingDonationDetail {
  item: string;
  newQuantity: number;
  usedQuantity: number;
}

export interface IncomingDonationType {
  donationDetails: Array<IncomingDonationDetail>;
}
export interface IncomingDonationWithIDType extends IncomingDonationType {
  id: number;
}

export interface DonationQueryType {
  page: number;
  pageSize: number;
  sort: string;
  order: string;
  id: number;
  date: Date;
  organization: string;
  total: number;
  items: string;
  type: string;
}

export interface DonationsDashboardDisplay {
  id: number;
  date: Date;
  organization: string;
  total: number;
  items: string;
  type: string;
}
