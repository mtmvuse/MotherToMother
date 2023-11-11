export interface DonationType{
    id: number;
    userID: number;
    date: Date;
}

export interface DonationDetailsType{
    id: number;
    itemID: number;
    donationID: number;
    quantityUsed: number;
    quantityNew: number;
}

export interface DonationDetailType{
    itemId: number;
    quantityUsed: number;
    quantityNew: number;
}
