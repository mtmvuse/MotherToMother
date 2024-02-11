import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as DonationService from "./donation.service";
import { getUserByEmail } from "../user/user.service";
import { getItemsCategoryName, updateItem } from "../item/item.service";
import {
  type OutgoingDonationRequestBodyType,
  type DonationDetailType,
  type OutgoingDonationStatsType,
} from "../../../types/donation";

interface QueryType {
  page: string;
  pageSize: string;
}

const donationRouter = express.Router();

donationRouter.get(
  "/v1",
  async (
    req: Request<any, any, any, QueryType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page, 10);
      const pageSize = parseInt(req.query.pageSize, 10);
      const donations = await DonationService.getTransactions(page, pageSize);
      const totalNumber = await DonationService.getTotalNumberDonations();
      return res.status(200).json({ donations, totalNumber });
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

const isNonNegativeInteger = (value: number) => {
  return value >= 0 && Number.isInteger(value);
};

const createOutgoingDonation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Setting type of req.body to OutgoingDonationRequestBodyType
    const donationReqBody = req.body as OutgoingDonationRequestBodyType;

    if (!donationReqBody.userId) {
      // Then get the ID from the email
      const user = await getUserByEmail(donationReqBody.email);

      if (!user) {
        throw new Error(
          `No user with the given email: ${donationReqBody.email}`,
        );
      }

      donationReqBody.userId = user.id;
    }

    // Get the id for each item in outgoing donation request
    await Promise.all(
      donationReqBody.donationDetails.map(async (itemDetail, index) => {
        if (!itemDetail.itemId) {
          // Get the id from its category and name
          if (!itemDetail.category || !itemDetail.item) {
            throw new Error(
              "Missing a category or an item for one or more item on the request. ",
            );
          }

          const items = await getItemsCategoryName(
            itemDetail.category,
            itemDetail.item,
          );

          if (!items) {
            throw new Error(
              `No item with the given (category, name): (${itemDetail.category}, ${itemDetail.item})`,
            );
          } else if (items.length > 1) {
            throw new Error(
              `More than one item found by the given (category, name): (${itemDetail.category}, ${itemDetail.item})`,
            );
          }

          // Check if quantity is valid (not negative integer)
          if (!isNonNegativeInteger(itemDetail.newQuantity)) {
            throw new Error("Quantity of items must be non-negative integers");
          }

          donationReqBody.donationDetails[index].itemId = items[0].id;
        }
      }),
    );

    // Validate the numberServed and demographic numbers
    if (
      !isNonNegativeInteger(donationReqBody.numberServed) ||
      !isNonNegativeInteger(donationReqBody.whiteNum) ||
      !isNonNegativeInteger(donationReqBody.latinoNum) ||
      !isNonNegativeInteger(donationReqBody.blackNum) ||
      !isNonNegativeInteger(donationReqBody.nativeNum) ||
      !isNonNegativeInteger(donationReqBody.asianNum) ||
      !isNonNegativeInteger(donationReqBody.otherNum)
    ) {
      throw new Error(
        "NumberServed and demographic numbers must be non-negative integers",
      );
    }

    // here is start updating the database
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

    // Update the quantity of each item
    await Promise.all(
      donationReqBody.donationDetails.map(async (itemDetail) => {
        await updateItem(
          itemDetail.itemId,
          itemDetail.newQuantity,
          itemDetail.usedQuantity,
        );
      }),
    );

    return res.status(200).json(newOutgoingDonationStats);
  } catch (e) {
    next(e);
  }
};

donationRouter.post("/v1/outgoing", createOutgoingDonation);

export { donationRouter };
