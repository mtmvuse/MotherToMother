import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as DonationService from "./donation.service";
import { updateItem, getItemsName, getItemFromID } from "../item/item.service";
import type {
  OutgoingDonationRequestBodyType,
  DonationDetailType,
  OutgoingDonationStatsType,
  DonationQueryType,
  DonationsDashboardDisplay,
  PUTOutgoingDonationRequestBodyType,
  PUTDonationRequestBodyType,
  DonationRequestBodyType,
} from "../../../types/donation";
import {
  translateFilterToPrisma,
  translateSortToPrisma,
} from "../../../utils/lib";
import type { Prisma } from "@prisma/client";

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
      next(e);
    }
  },
);

const isNonNegativeInteger = (value: number) => {
  return value >= 0 && Number.isInteger(value);
};

/**
 * Create an outgoing donation
 */
const createOutgoingDonation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const donationReqBody = req.body as OutgoingDonationRequestBodyType;
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

    await Promise.all(
      donationReqBody.donationDetails.map(async (itemDetail) => {
        const item = await getItemFromID(itemDetail.itemId);

        if (!item) {
          throw new Error(`No item with the given id: ${itemDetail.itemId}`);
        }

        if (item.quantityNew < itemDetail.newQuantity) {
          throw new Error(
            `Not enough stock for the new item: ${item.name}. Stock: ${item.quantityNew}`,
          );
        }

        if (item.quantityUsed < itemDetail.usedQuantity) {
          throw new Error(
            `Not enough stock for the used item: ${item.name}. Stock: ${item.quantityUsed}`,
          );
        }
      }),
    );

    // ----------------------- Here, it start updating the database -------------------------------
    const newDonation = await DonationService.createDonation(
      donationReqBody.userId,
      donationReqBody.date,
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

/**
 * Update an outgoing donation
 */
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
    }

    await Promise.all(
      donationReqBody.donationDetails.map(async (donationDetail) => {
        const item = await getItemsName(donationDetail.item!);

        if (!item) {
          throw new Error(
            `No item with the given name: ${donationDetail.item}`,
          );
        } else if (item.length > 1) {
          throw new Error(
            `More than one item found by the given name: ${donationDetail.item}`,
          );
        }

        const prevDonationDetail = await DonationService.getDonationDetails(
          donationId,
          item[0].id,
        );

        if (!prevDonationDetail) {
          // If it is new item not in the donation
          if (item[0].quantityNew < donationDetail.newQuantity) {
            throw new Error(
              `Not enough stock for the new item: ${donationDetail.item}. Stock: ${item[0].quantityNew}`,
            );
          }

          if (item[0].quantityUsed < donationDetail.usedQuantity) {
            throw new Error(
              `Not enough stock for the used item: ${donationDetail.item}. Stock: ${item[0].quantityUsed}`,
            );
          }
        } else {
          // If it is an existing item in the donation, update by the difference
          if (
            item[0].quantityNew + prevDonationDetail.newQuantity <
            donationDetail.newQuantity
          ) {
            throw new Error(
              `Not enough stock for the new item: ${
                donationDetail.item
              }. Stock: ${
                item[0].quantityNew + prevDonationDetail.newQuantity
              }`,
            );
          }

          if (
            item[0].quantityUsed + prevDonationDetail.usedQuantity <
            donationDetail.usedQuantity
          ) {
            throw new Error(
              `Not enough stock for the used item: ${
                donationDetail.item
              }. Stock: ${
                item[0].quantityUsed + prevDonationDetail.usedQuantity
              }`,
            );
          }
        }
      }),
    );

    // ---------------------- Updating the OutgoingDonationStats Table -------------------------
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

    return res.status(200).json({ message: "Outgoing Donation Updated" });
  } catch (e) {
    next(e);
  }
};

/**
 * Create an incoming donation
 */
donationRouter.post(
  "/v1/incoming",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donationReqBody = req.body as DonationRequestBodyType;
      await Promise.all(
        donationReqBody.donationDetails.map(async (itemDetail) => {
          const item = await getItemFromID(itemDetail.itemId);
          if (!item) {
            throw new Error(`No item with the given id: ${itemDetail.itemId}`);
          }
        }),
      );

      // ----------------------- Here, it start updating the database -------------------------------
      const newDonation = await DonationService.createDonation(
        donationReqBody.userId,
        donationReqBody.date,
      );

      donationReqBody.donationDetails.forEach(
        async (donationDetail: DonationDetailType) => {
          await DonationService.createDonationDetails(
            newDonation.id,
            donationDetail,
          );
        },
      );

      // Update the quantity of each item
      await Promise.all(
        donationReqBody.donationDetails.map(async (itemDetail) => {
          await updateItem(
            itemDetail.itemId,
            itemDetail.usedQuantity,
            itemDetail.newQuantity,
          );
        }),
      );

      return res.status(200).json({ message: "Incoming Donation Created" });
    } catch (e) {
      next(e);
    }
  },
);

/**
 * Update an incoming donation
 */
donationRouter.put(
  "/v1/incoming",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donationReqBody = req.body as DonationRequestBodyType;
      const donationIdString = req.params.donationId;

      // ------------------------------------ Validations ------------------------------------
      if (!donationIdString) {
        throw new Error("Missing donationId");
      } else if (!isNonNegativeInteger(parseInt(donationIdString, 10))) {
        throw new Error("DonationId must be a non-negative integer");
      }
      const donationId = parseInt(donationIdString, 10);
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
      }
      // Update the DonationDetails Table and the Item Table
      await Promise.all(
        donationReqBody.donationDetails.map(async (donationDetail) => {
          const itemFromName = await getItemsName(donationDetail.item!);
          if (!itemFromName) {
            throw new Error(
              `No item with the given name: ${donationDetail.item}`,
            );
          } else if (itemFromName.length > 1) {
            throw new Error(
              `More than one item found by the given name: ${donationDetail.item}`,
            );
          }
          donationDetail.itemId = itemFromName[0].id;

          const prevDonationDetail = await DonationService.getDonationDetails(
            donationId,
            donationDetail.itemId,
          );

          await DonationService.updateDonationDetails(
            donationId,
            donationDetail,
          );

          if (prevDonationDetail) {
            await updateItem(
              donationDetail.itemId,
              donationDetail.usedQuantity - prevDonationDetail.usedQuantity,
              donationDetail.newQuantity - prevDonationDetail.newQuantity,
            );
          } else {
            await updateItem(
              donationDetail.itemId,
              donationDetail.usedQuantity,
              donationDetail.newQuantity,
            );
          }
        }),
      );

      // If an item is removed from donation when updating, then item is added back to the inventory
      const updatedDeletedItems = async () => {
        const getAllItemsInDonation =
          await DonationService.getAllItemsInDonation(donationId);
        getAllItemsInDonation.forEach(async (item) => {
          const itemInNewDonation = donationReqBody.donationDetails.find(
            (itemDetail) => itemDetail.itemId === item.itemId,
          );

          // Reset back the quantity of the item in the inventory
          if (!itemInNewDonation) {
            await updateItem(
              item.itemId,
              -item.usedQuantity,
              -item.newQuantity,
            );

            // Update the deleted items in the DonationDetails Table
            await DonationService.deleteRowInDonationDetails(
              donationId,
              item.itemId,
            );
          }
        });
      };

      await updatedDeletedItems();
      return res.status(200).json({ message: "Outgoing Donation Updated" });
    } catch (e) {
      next(e);
    }
  },
);

/**
 * Get the details of a donation
 */
donationRouter.get(
  "/v1/details/:donationId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donationId = req.params.donationId;

      const donationDetails = await DonationService.getDonationDetailsId(
        parseInt(donationId),
      );

      const itemDetails = [];

      for (const detail of donationDetails) {
        const itemId = detail.itemId;

        const item = await getItemFromID(itemId);

        itemDetails.push({
          id: itemId,
          name: item?.name,
          quantityUsed: detail.usedQuantity,
          quantityNew: detail.newQuantity,
          valueUsed: item?.valueUsed,
          valueNew: item?.valueNew,
        });
      }

      return res.status(200).json(itemDetails);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Delete a donation
 */
donationRouter.delete(
  "/v1/delete/:donationId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donationId = req.params.donationId;
      const donation = await DonationService.deleteDonation(
        parseInt(donationId),
      );
      return res.status(200).json(donation);
    } catch (e) {
      next(e);
    }
  },
);

/**
 * Get the demographic details of an outgoing donation
 */
donationRouter.get(
  "/v1/demographics/:donationId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donationId = req.params.donationId;
      const donationDetails = await DonationService.getDemographicDetailsId(
        parseInt(donationId),
      );
      return res.status(200).json(donationDetails);
    } catch (error) {
      next(error);
    }
  },
);

export { donationRouter };

donationRouter.post("/v1/outgoing", createOutgoingDonation);
donationRouter.put("/v1/outgoing/:donationId", updateOutgoingDonation);
