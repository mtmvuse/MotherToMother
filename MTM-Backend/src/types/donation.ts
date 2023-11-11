export interface OutgoingDonationType {
    id?: number;
    requesterID: number;       
    date: Date;                
    numberServed: number;      
    whiteNum: number;          
    latinoNum: number;      
    blackNum: number;          
    nativeNum: number;         
    asianNum: number;
    otherNum: number;          
  }
  
export interface IncomingDonationType {
}

export interface DonationDetailsType {
    itemID: number;                
    quantityOld: number;         
    quantityNew: number;         
    outgoingDonationId: number;
}

export interface ItemType {
    id?: number;
    name: string;             
}