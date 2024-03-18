import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as DonationService from "./donation.service";
import { getUserByEmail } from "../user/user.service";
import {
  getItemsCategoryName,
  updateItem,
  getItemsName,
} from "../item/item.service";
import type {
  OutgoingDonationRequestBodyType,
  DonationDetailType,
  OutgoingDonationStatsType,
  IncomingDonationType,
  IncomingDonationTypeWithID,
  IncomingDonationWithIDType,
  DonationQueryType,
  DonationsDashboardDisplay,
  PUTOutgoingDonationRequestBodyType,
} from "../../../types/donation";
import {
  translateFilterToPrisma,
  translateSortToPrisma,
} from "../../../utils/lib";
import type { Prisma } from "@prisma/client";

interface QueryTypeID {
  id: string;
}

const donationRouter = express.Router();

donationRouter.get(
  "/v1",
  async (
    req: Request<any, any, any, DonationQueryType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const query = req.query;
      const { page, pageSize, sort, order, ...filters } = query;
      const pageInt = Number(page);
      const pageSizeInt = Number(pageSize);
      const typedFilters = {
        ...filters,
        id: filters.id && Number(filters.id),
      };
      const whereClause = translateFilterToPrisma(
        typedFilters,
      ) as DonationsDashboardDisplay;
      const orderBy = translateSortToPrisma(
        sort,
        order,
      ) as Prisma.user_dashboardAvgOrderByAggregateInput;
      const donationsAP = await DonationService.getDonationsAP(
        pageInt,
        pageSizeInt,
        whereClause,
        orderBy,
      );
      const count =
        await DonationService.getDonationDashboardCount(whereClause);
      return res.status(200).json({ donationsAP, totalNumber: count });
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

    // ----------------------- Here is start updating the database -------------------------------
    const newDonation = await DonationService.createDonation(
      donationReqBody.userId,
    );

    donationReqBody.donationDetails.forEach(
      async (donationDetail: DonationDetailType) => {
        const newDonationDetail: DonationDetailType =
          await DonationService.createDonationDetails(
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
          -itemDetail.usedQuantity,
          -itemDetail.newQuantity,
        );
      }),
    );

    return res.status(200).json(newOutgoingDonationStats);
  } catch (e) {
    next(e);
  }
};

const updateOutgoingDonation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const donationReqBody = req.body as PUTOutgoingDonationRequestBodyType;
    const donationIdString = req.params.donationId;

    // Validations
    if (!donationIdString) {
      throw new Error("Missing donationId");
    } else if (!isNonNegativeInteger(parseInt(donationIdString, 10))) {
      throw new Error("DonationId must be a non-negative integer");
    }
    const donationId = parseInt(donationIdString, 10);

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

    for (const donationDetail of donationReqBody.donationDetails) {
      if (
        !isNonNegativeInteger(donationDetail.usedQuantity) ||
        !isNonNegativeInteger(donationDetail.newQuantity)
      ) {
        throw new Error("Quantity of items must be non-negative integers");
      }

      if (!donationDetail.item) {
        throw new Error("Missing item name");
      }

      // Check if item exists in the database
      const items = await getItemsName(donationDetail.item);

      if (!items) {
        throw new Error(`No item with the given name: ${donationDetail.item}`);
      } else if (items.length > 1) {
        throw new Error(
          `More than one item found by the given name: ${donationDetail.item}`,
        );
      }
    }

    console.log("Done with validations");

    // Updating the OutgoingDonationStats Table
    await DonationService.updateOutgoingDonationStats(
      donationId,
      donationReqBody.numberServed,
      donationReqBody.whiteNum,
      donationReqBody.latinoNum,
      donationReqBody.blackNum,
      donationReqBody.nativeNum,
      donationReqBody.asianNum,
      donationReqBody.otherNum,
    );

    // Update the DonationDetails Table and the Item Table
    await Promise.all(
      donationReqBody.donationDetails.map(async (donationDetail) => {
        const prevDonationDetail = await DonationService.getDonationDetails(
          donationId,
          donationDetail.itemId,
        );

        const itemFromName = await getItemsName(donationDetail.item!);

        donationDetail.itemId = itemFromName![0].id;

        await DonationService.updateDonationDetails(donationId, donationDetail);

        await updateItem(
          donationDetail.itemId,
          prevDonationDetail!.usedQuantity - donationDetail.usedQuantity,
          prevDonationDetail!.newQuantity - donationDetail.newQuantity,
        );
      }),
    );

    return res.status(200).json({ message: "Outgoing Donation Updated" });
  } catch (e) {
    next(e);
  }
};

donationRouter.post("/v1/outgoing", createOutgoingDonation);

donationRouter.post(
  "/v1/incoming",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donationReqBody = req.body as IncomingDonationTypeWithID;
      // validate body - make sure there's items with names and quantities
      if (!donationReqBody.userId || !donationReqBody.products) {
        return res.status(400).json({
          error: "User ID and/or Products must be entered",
        });
      }
      // make sure the user exists by checking the id in the database
      const createdDonation =
        await DonationService.createIncomingDonation(donationReqBody);

      return res.status(200).json(createdDonation);
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
    try {
      const body = req.body as IncomingDonationType;
      const donationId = parseInt(req.query.id);
      if (!donationId) {
        return res.status(400).json({
          error: "ID must be entered",
        });
      }

      // create object with IncomingDonationWithIDType
      const incomingDonation: IncomingDonationWithIDType = {
        id: donationId,
        donationDetails: body.donationDetails,
      };

      const donations =
        await DonationService.updateIncomingDonation(incomingDonation);

      if (donations) {
        return res.status(200).json({
          donations,
        });
      } else {
        return res.status(400).json({
          error: "Donation does not exist",
        });
      }
    } catch (e) {
      next(e);
    }
  },
);

export { donationRouter };

// TODO: What if donationID doesn't exist
// TODO: What if try to edit item which they didn't take out?
// Are they allow to update outgoing donation and add new items?
// TODO: Do I have to check that user taking out more than stock?
