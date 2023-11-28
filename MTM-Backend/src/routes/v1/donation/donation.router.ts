import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as DonationService from "./donation.service";
import {
  type DonationRequestBodyType,
  type DonationDetailType,
  type OutgoingDonationStatsType,
} from "../../../types/donation";

const donationRouter = express.Router();

const createOutgoingDonation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Setting type of req.body to DonationRequestBodyType
    const donationReqBody = req.body as DonationRequestBodyType;

    const newDonation = await DonationService.createDonation(
      donationReqBody.userId,
    );

    donationReqBody.donationDetails.forEach(
      async (donationDetail: DonationDetailType) => {
        const newDonationDetail: DonationDetailType =
          await DonationService.createDonationDetails(
            donationDetail.itemId,
            newDonation.id,
            donationDetail,
          );
      },
    );

    const newOutgoingDonationStats: OutgoingDonationStatsType =
      await DonationService.createOutgoingDonationStats(
        newDonation.id,
        donationReqBody.numberServed,
        donationReqBody.whiteNum,
        donationReqBody.latinoNum,
        donationReqBody.blackNum,
        donationReqBody.nativeNum,
        donationReqBody.asianNum,
        donationReqBody.otherNum,
      );

    return res.status(200).json(newOutgoingDonationStats);
  } catch (e) {
    next(e);
  }
};

donationRouter.post("/createOutgoingDonation", createOutgoingDonation);

export { donationRouter };
