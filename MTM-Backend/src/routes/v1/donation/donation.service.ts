import { db } from "../../../utils/db.server";
import type {
  DonationType,
  DonationDetailType,
  OutgoingDonationStatsType,
  DashboardDonationDetailType,
  IncomingDonationTypeWithID,
  IncomingDonationWithIDType,
  DonationsDashboardDisplay,
  PUTIncomingDonationRequestBodyType,
} from "../../../types/donation";
import { getItemsName, updateItem } from "../item/item.service";
import type { Prisma } from "@prisma/client";

export const getDonationsAP = async (
  page: number,
  pageSize: number,
  whereClause: Prisma.donation_detailWhereInput,
  orderBy: Prisma.DonationDetailOrderByWithRelationInput,
): Promise<DonationsDashboardDisplay[]> => {
  // console.log("whereClause", whereClause);
  const donationDetails = await db.donation_detail.findMany({
    where: whereClause,
    take: pageSize,
    skip: page * pageSize,
    orderBy: orderBy,
  });
  //  console.log(donationDetails);

  return donationDetails.map((detail) => ({
    id: detail.id,
    date: detail.date,
    organization: detail.organization,
    total: detail.total ? detail.total : 0,
    items:
      detail.items !== null
        ? typeof detail.items === "number"
          ? detail.items
          : detail.items.toNumber()
        : 0,
    type: detail.type,
  }));
};

export const getDonationDashboardCount = async (
  whereClause: Prisma.donation_detailWhereInput,
): Promise<number> => {
  return db.donation_detail.count({
    where: whereClause,
  });
};

export const getTransactions = async (page: number, pageSize: number) => {
  const skip = page * pageSize;
  const donations = await db.donation.findMany({
    skip,
    take: pageSize,
    include: {
      user: {
        include: {
          Organization: true,
        },
      },
      DonationDetail: {
        include: {
          item: true,
        },
      },
    },
  });

  const transformedData = donations.map((donation) => {
    const details: DashboardDonationDetailType[] = [];

    donation.DonationDetail.forEach((detail) => {
      // If there are used items, create a separate entry for them
      if (detail.usedQuantity > 0) {
        details.push({
          itemId: detail.item.id,
          item: detail.item.name,
          status: "Used",
          value: detail.item.valueUsed,
          quantity: detail.usedQuantity,
          total: detail.usedQuantity * detail.item.valueUsed,
        });
      }

      // If there are new items, create a separate entry for them
      if (detail.newQuantity > 0) {
        details.push({
          itemId: detail.item.id,
          item: detail.item.name,
          status: "New",
          value: detail.item.valueNew,
          quantity: detail.newQuantity,
          total: detail.newQuantity * detail.item.valueNew,
        });
      }
    });

    // Sum the total value of all items in the donation
    const totalValue: number = details.reduce(
      (acc: number, detail: DashboardDonationDetailType) => acc + detail.total,
      0,
    );

    // Return the transformed donation data with separate entries for new and used items
    return {
      id: donation.id,
      date: donation.date,
      organization: donation.user.Organization?.name || "Individual",
      total: totalValue,
      items: details.length, // The count of all item entries (both new and used)
      type: donation.user.Organization
        ? donation.user.Organization.type
        : "Individual",
      details: details,
    };
  });

  return transformedData;
};

export const createDonation = async (userId: number): Promise<DonationType> => {
  return db.donation.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const getDonationDetails = async (
  donationId: number,
  itemId: number,
) => {
  return db.donationDetail.findUnique({
    where: {
      donationId_itemId: {
        donationId: donationId,
        itemId: itemId,
      },
    },
  });
};

export const createDonationDetails = async (
  donationId: number,
  donationDetails: DonationDetailType,
): Promise<DonationDetailType> => {
  return db.donationDetail.create({
    data: {
      item: {
        connect: {
          id: donationDetails.itemId,
        },
      },
      donation: {
        connect: {
          id: donationId,
        },
      },
      usedQuantity: donationDetails.usedQuantity,
      newQuantity: donationDetails.newQuantity,
    },
  });
};

export const updateDonationDetails = async (
  donationId: number,
  itemDetails: DonationDetailType,
): Promise<DonationDetailType> => {
  return db.donationDetail.update({
    where: {
      donationId_itemId: {
        donationId: donationId,
        itemId: itemDetails.itemId,
      },
    },
    data: {
      usedQuantity: itemDetails.usedQuantity,
      newQuantity: itemDetails.newQuantity,
    },
  });
};

export const createOutgoingDonationStats = async (
  donationId: number,
  numberServed: number,
  whiteNum: number,
  latinoNum: number,
  blackNum: number,
  nativeNum: number,
  asianNum: number,
  otherNum: number,
): Promise<OutgoingDonationStatsType> => {
  return db.outgoingDonationStats.create({
    data: {
      donation: {
        connect: {
          id: donationId,
        },
      },
      numberServed: numberServed,
      whiteNum: whiteNum,
      latinoNum: latinoNum,
      blackNum: blackNum,
      nativeNum: nativeNum,
      asianNum: asianNum,
      otherNum: otherNum,
    },
  });
};

export const updateOutgoingDonationStats = async (
  donationId: number,
  numberServed: number,
  whiteNum: number,
  latinoNum: number,
  blackNum: number,
  nativeNum: number,
  asianNum: number,
  otherNum: number,
): Promise<OutgoingDonationStatsType> => {
  return db.outgoingDonationStats.update({
    where: {
      donationId: donationId,
    },
    data: {
      numberServed: numberServed,
      whiteNum: whiteNum,
      latinoNum: latinoNum,
      blackNum: blackNum,
      nativeNum: nativeNum,
      asianNum: asianNum,
      otherNum: otherNum,
    },
  });
};

export const createIncomingDonation = async (
  incomingDonation: IncomingDonationTypeWithID,
) => {
  const user = await db.user.findUnique({
    where: {
      id: incomingDonation.userId,
    },
  });
  // console.log(user, incomingDonation.userId);
  if (!user) {
    throw new Error(`No user with the given ID: ${incomingDonation.userId}`);
  }

  const donation = await db.donation.create({
    data: {
      userId: incomingDonation.userId,
      date: new Date(),
    },
  });
  // For each product, update the inventory and create donation details entries
  for (const product of incomingDonation.products) {
    // console.log("PRODUCT:", product);
    const items = await getItemsName(product.name);
    if (items && items !== null && items.length > 0) {
      // find the correct item by name and update the quantity
      // console.log("ITEMS: ", items, product.quantity);
      for (const item of items) {
        console.log(item.name, product.name, item.name == product.name);
        if (item.name == product.name) {
          // console.log("FOUND ITEM: ", item, product.quantity);
          const newItem = await updateItem(item.id, product.quantity, 0);
          // console.log("NEW ITEM: ", newItem);
          await db.donationDetail.create({
            data: {
              donationId: donation.id,
              itemId: item.id,
              newQuantity: 0,
              usedQuantity: product.quantity,
            },
          });
        }
      }
    }
  }
  return donation;
};

export const updateIncomingDonation = async (
  incomingDonation: IncomingDonationWithIDType,
) => {
  const donationReqBody =
    incomingDonation as PUTIncomingDonationRequestBodyType;

  // Validations
  if (incomingDonation.id < 0) {
    throw new Error("DonationId must be a non-negative integer");
  }
  console.log(incomingDonation.id, "incomingDonation.id");
  const donationExists = await db.donation.findUnique({
    where: { id: incomingDonation.id },
  });

  if (!donationExists) {
    throw new Error("Invalid DonationID");
  }

  for (const donationDetail of donationReqBody.donationDetails) {
    console.log(
      donationDetail.usedQuantity,
      donationDetail.newQuantity,
      donationDetail.item,
    );
    console.log(donationDetail);
    if (donationDetail.usedQuantity < 0 || donationDetail.newQuantity < 0) {
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
    } else if (items.length === 1) {
      // set itemId
      donationDetail.itemId = items[0].id;
    }
  }

  console.log("Done with validations");
  console.log(
    donationReqBody.donationDetails,
    "donationReqBody.donationDetails",
  );

  // for loop to set donationDetail.itemId

  // Update the DonationDetails Table and the Item Table
  await Promise.all(
    donationReqBody.donationDetails.map(async (donationDetail) => {
      console.log(donationDetail);
      const prevDonationDetail = await getDonationDetails(
        donationExists.id,
        donationDetail.itemId,
      );

      const itemFromName = await getItemsName(donationDetail.item!);

      donationDetail.itemId = itemFromName![0].id;

      await updateDonationDetails(donationExists.id, donationDetail);

      await updateItem(
        donationDetail.itemId,
        prevDonationDetail!.usedQuantity - donationDetail.usedQuantity,
        prevDonationDetail!.newQuantity - donationDetail.newQuantity,
      );
    }),
  );
  // return updated donation
  return donationExists;
};
