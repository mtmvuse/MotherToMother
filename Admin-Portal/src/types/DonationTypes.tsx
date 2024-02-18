export interface itemTypes {
  id: number;
  item: string;
  status: string;
  value: number;
  quantity: number;
}

export interface demographicTypes {
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
