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
import {
  
  type OutgoingDonationRequestBodyType,
  type DonationDetailType,
  type OutgoingDonationStatsType,
  type PUTOutgoingDonationRequestBodyType,
  type IncomingDonationRequestBodyType,
  type IncomingDonationType,
  type IncomingDonationTypeWithID,
  type IncomingDonationWithIDType,
import { getItemsCategoryName } from "../item/item.service";

import type {
  OutgoingDonationRequestBodyType,
  DonationDetailType,
  OutgoingDonationStatsType,
  IncomingDonationType,
  IncomingDonationTypeWithID,
  IncomingDonationWithIDType,
  DonationQueryType,
  DonationsDashboardDisplay,
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

    // ----------------------- Here it start updating the database -------------------------------
    const newDonation = await DonationService.createDonation(
      donationReqBody.userId,
    );

    donationReqBody.donationDetails.forEach(
      async (donationDetail: DonationDetailType) => {
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
        // Check if stock would go negative
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

    // ------------------------------------ Validations ------------------------------------
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

    // -------------------------- Item Validation ------------------------------
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
        const itemFromName = await getItemsName(donationDetail.item!);
        donationDetail.itemId = itemFromName![0].id;

        const prevDonationDetail = await DonationService.getDonationDetails(
          donationId,
          donationDetail.itemId,
        );

        await DonationService.updateDonationDetails(donationId, donationDetail);

        // Update the Item Table quantity based on the difference between the new and previous quantity
        if (prevDonationDetail) {
          await updateItem(
            donationDetail.itemId,
            prevDonationDetail.usedQuantity - donationDetail.usedQuantity,
            prevDonationDetail.newQuantity - donationDetail.newQuantity,
          );
        } else {
          await updateItem(
            donationDetail.itemId,
            -donationDetail.usedQuantity,
            -donationDetail.newQuantity,
          );
        }
      }),
    );

    // If an item is removed from donation when updating, then item is added back to the inventory
    const updatedDeletedItems = async () => {
      const getAllItemsInDonation =
        await DonationService.getAllItemsInDonation(donationId);
      getAllItemsInDonation.forEach(async (item) => {
<<<<<<< HEAD
=======
        const itemInPrevDonation = await DonationService.getDonationDetails(
          donationId,
          item.itemId,
        );

>>>>>>> 0b2a41c (Solving Merge Conflict)
        const itemInNewDonation = donationReqBody.donationDetails.find(
          (itemDetail) => itemDetail.itemId === item.itemId,
        );

        // Reset back the quantity of the item in the inventory
        if (!itemInNewDonation) {
          await updateItem(item.itemId, item.usedQuantity, item.newQuantity);

          // Update the deleted items in the DonationDetails Table
          await DonationService.deleteRowInDonationDetails(
            donationId,
            item.itemId,
          );
        }
      });
    };

    await updatedDeletedItems();

    // Update Date in Donation Table
    await DonationService.updateDonationDate(donationId, new Date());

    return res.status(200).json({ message: "Outgoing Donation Updated" });
  } catch (e) {
    next(e);
  }
};

donationRouter.post("/v1/outgoing", createOutgoingDonation);

donationRouter.put("/v1/outgoing/:donationId", updateOutgoingDonation);
donationRouter.post(
  "/v1/incoming",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donationReqBody = req.body as IncomingDonationTypeWithID;
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
<<<<<<< HEAD
=======
// TODO: Do I have to check that user taking out more than stock?
>>>>>>> 0b2a41c (Solving Merge Conflict)
