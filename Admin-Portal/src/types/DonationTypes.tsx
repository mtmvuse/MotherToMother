export interface ResponseDonation {
  id: number;
  date: Date;
  organization: string;
  total: number;
  items: number;
  type: string;
}

export interface DonationDashboardResponse {
  donations: ResponseDonation[];
  totalNumber: number;
}

export interface ItemDetails {
  id: number;
  name: string;
  quantityNew: number;
  quantityUsed: number;
  valueNew: number;
  valueUsed: number;
}

export interface DemographicDetails {
  id: number;
  kidGroup: string;
  quantity: number;
}

export interface AddOutgoingDonationType {
  userId: number;
  donationDetails: {
    itemId: number;
    usedQuantity: number;
    newQuantity: number;
  }[];
  numberServed: number;
  whiteNum: number;
  latinoNum: number;
  blackNum: number;
  nativeNum: number;
  asianNum: number;
  otherNum: number;
}

export interface AddIncomingDonationType {
  userId: number;
  donationDetails: {
    itemId: number;
    usedQuantity: number;
    newQuantity: number;
  }[];
}

export interface UpdateOutgoingDonationType {
  donationDetails: {
    item: string;
    usedQuantity: number;
    newQuantity: number;
  }[];
  numberServed: number;
  whiteNum: number;
  latinoNum: number;
  blackNum: number;
  nativeNum: number;
  asianNum: number;
  otherNum: number;
}

export interface ItemSelection {
  name: string;
  category: string;
  valueUsed: number;
  valueNew: number;
}
