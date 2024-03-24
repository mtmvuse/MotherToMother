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

export interface OutgoingDonationRequestBodyType
  extends DonationRequestBodyType {
  numberServed: number;
  whiteNum: number;
  latinoNum: number;
  blackNum: number;
  nativeNum: number;
  asianNum: number;
  otherNum: number;
}

export interface DonationRequestBodyType {
  userId: number;
  date: Date;
  donationDetails: Array<DonationDetailType>;
}

export interface PUTDonationRequestBodyType {
  donationDetails: Array<DonationDetailType>;
}

export interface PUTOutgoingDonationRequestBodyType
  extends PUTDonationRequestBodyType {
  numberServed: number;
  whiteNum: number;
  latinoNum: number;
  blackNum: number;
  nativeNum: number;
  asianNum: number;
  otherNum: number;
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

export interface ProductType {
  name: string;
  quantity: number;
}

export interface IncomingDonationRequestBodyType {
  products: Array<ProductType>;
}

export interface IncomingDonationDetail {
  item: string;
  newQuantity: number;
  usedQuantity: number;
}

export interface DonationQueryType {
  page: number;
  pageSize: number;
  sort: string;
  order: string;
  id: number;
  date: Date;
  organization: string;
  total: number | null;
  items: string;
  type: string;
}

export interface DonationsDashboardDisplay {
  id: number;
  date: Date;
  organization: string;
  total: number;
  items: number;
  type: string;
}
