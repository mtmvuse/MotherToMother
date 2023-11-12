import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as DonationService from "./donation.service";
import { DonationDetailType } from "../../../types/donation";

const donationRouter = express.Router();

const createOutgoingDonation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newDonation = await DonationService.createDonation(req.body.userId);

    req.body.donationDetails.forEach(
      async (donationDetail: DonationDetailType) => {
        const newDonationDetail = await DonationService.createDonationDetails(
          donationDetail.itemId,
          newDonation.id,
          donationDetail,
        );
      },
    );

    const newOutgoingDonationStats =
      await DonationService.createOutgoingDonationStats(
        newDonation.id,
        req.body.numberServed,
        req.body.whiteNum,
        req.body.latinoNum,
        req.body.blackNum,
        req.body.nativeNum,
        req.body.asianNum,
        req.body.otherNum,
      );

    return res.status(200).json(newOutgoingDonationStats);
  } catch (e) {
    next(e);
  }
};

donationRouter.post("/createOutgoingDonation", createOutgoingDonation);

export { donationRouter };
