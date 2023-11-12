export interface DonationType {
  id: number;
  userID: number;
  date: Date;
}

// Type for detail for each items when calling createDonationDetails
export interface DonationDetailType {
  itemId: number;
  quantityUsed: number;
  quantityNew: number;
}

// Type for the details for the whole donation
export interface DonationDetailsType {
  id: number;
  itemID: number;
  donationID: number;
  quantityUsed: number;
  quantityNew: number;
}
