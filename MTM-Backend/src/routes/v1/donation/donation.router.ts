import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as DonationService from "./donation.service";
import { getUserByEmail } from "../user/user.service";
import { getItemsCategoryName } from "../item/item.service";
import {
  type OutgoingDonationRequestBodyType,
  type DonationDetailType,
  type OutgoingDonationStatsType,
  type IncomingDonationRequestBodyType,
} from "../../../types/donation";

interface QueryType {
  page: string;
  pageSize: string;
}

interface QueryTypeID {
  id: string;
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
      if (!page || !pageSize || page <= 0 || pageSize <= 0) {
        return res.status(400).json({
          error: "Page and pageSize must be entered and greater than 0",
        });
      }
      const donation = await DonationService.getTransactions(page, pageSize);
      return res.status(200).json(donation);
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

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

          donationReqBody.donationDetails[index].itemId = items[0].id;
        }
      }),
    );

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

donationRouter.post("/v1/outgoing", createOutgoingDonation);

donationRouter.post(
  "/v1/incoming",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donationReqBody = req.body as IncomingDonationRequestBodyType;
      if (!donationReqBody.userId) {
        return res.status(400).json({
          error: "User ID must be entered",
        });
      }
      // make sure the user exists by checking the id in the database
      const createdDonation =
        await DonationService.createIncomingDonation(donationReqBody);

      if (createdDonation) {
        return res.status(200).json({
          createdDonation,
        });
      } else {
        return res.status(400).json({
          error: "User does not exist",
        });
      }
    } catch (e) {
      next(e);
    }
  },
);

donationRouter.put(
  "/v1/incoming",
  async (
    req: Request<any, any, any, QueryTypeID>,
    res: Response,
    next: NextFunction,
  ) => {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({
        error: "ID must be entered",
      });
    }
    const donationReqBody = req.body as IncomingDonationRequestBodyType;

    await DonationService.updateIncomingDonation(id, donationReqBody);

    return res.status(200).json({
      message: "Incoming donation updated successfully",
    });
  },
);

export { donationRouter };
