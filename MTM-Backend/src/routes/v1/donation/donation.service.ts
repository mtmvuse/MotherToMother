import { db } from "../../../utils/db.server";
import type { DonationType, DonationDetailsType } from "../../../types/donation";

export const createDonation = async (userID: number) : Promise<DonationType> => {
    return db.donation.create({
        data: {
            user: {
                connect: {
                    id: userID
                }
            }
        },
    });
}

export const createDonationDetails = async (itemID: number, donationID: number, donationDetails: any) : Promise<DonationDetailsType> => {
    return db.donationDetail.create({
        data: {
            item: {
                connect: {
                    id: itemID
                }
            },
            donation:{
                connect: {
                    id: donationID
                }
            },
            quantityUsed: donationDetails.usedQuantity,
            quantityNew: donationDetails.newQuantity
        }
    });
}

export const createOutgoingDonationStats = async (donationID: number, numberServed: number, whiteNum: number, latinoNum: number, blackNum: number, nativeNum: number, asianNum: number, otherNum: number) : Promise<any> => {
    return db.outgoingDonationStats.create({
        data: {
            donation: {
                connect: {
                    id: donationID
                }
            },
            numberServed: numberServed,
            whiteNum: whiteNum,
            latinoNum: latinoNum,
            blackNum: blackNum,
            nativeNum: nativeNum,
            asianNum: asianNum,
            otherNum: otherNum
        }
    })
}