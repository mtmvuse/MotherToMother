export interface DonationDetailType {
  item: string;
  category: string;
  newQuantity: number;
  usedQuantity: number;
}

export interface DemographicDetailType {
  numberServed: number;
  whiteNum: number;
  latinoNum: number;
  blackNum: number;
  nativeNum: number;
  asianNum: number;
  otherNum: number;
}

export type itemType = Record<string, [number, number]>;
export type categoryType = Record<string, itemType>;
