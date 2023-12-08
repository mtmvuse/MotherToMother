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

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;

  phone: string;
  address: string;
  zip: string;
  city: string;
  affiliation?: string;
}

export type itemType = Record<string, [number, number]>;
export type categoryType = Record<string, itemType>;
