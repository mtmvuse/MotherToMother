import { db } from "../../../utils/db.server";
import type {
  DonationType,
  DonationDetailType,
  DonationRequestBodyType,
  OutgoingDonationStatsType,
  IncomingDonationTypeWithID,
  IncomingDonationWithIDType,
  DonationsDashboardDisplay,
} from "../../../types/donation";
import { getItemFromID, updateItem } from "../item/item.service";
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

export const createDonation = async (
  userId: number,
  date: Date,
): Promise<DonationType> => {
  return db.donation.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      date: date,
    },
  });
};

export const updateDonationDate = async (
  donationId: number,
  date: Date,
): Promise<DonationType> => {
  return db.donation.update({
    where: {
      id: donationId,
    },
    data: {
      date: date,
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

export const getDonationDetailsId = async (donationId: number) => {
  return db.donationDetail.findMany({
    where: {
      donationId: donationId,
    },
  });
};

export const getDemographicDetailsId = async (donationId: number) => {
  return db.outgoingDonationStats.findUnique({
    where: {
      donationId: donationId,
    },
  });
};

export const getAllItemsInDonation = async (donationId: number) => {
  return db.donationDetail.findMany({
    where: {
      donationId: donationId,
    },
    include: {
      item: true,
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
  const isDonationId_itemIdInDb = await db.donationDetail.findUnique({
    where: {
      donationId_itemId: {
        donationId: donationId,
        itemId: itemDetails.itemId,
      },
    },
  });

  if (isDonationId_itemIdInDb) {
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
  } else {
    return createDonationDetails(donationId, itemDetails);
  }
};

export const deleteRowInDonationDetails = async (
  donationId: number,
  itemId: number,
) => {
  return db.donationDetail.delete({
    where: {
      donationId_itemId: {
        donationId: donationId,
        itemId: itemId,
      },
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

// export const updateIncomingDonation = async (
//   incomingDonation: IncomingDonationWithIDType,
// ) => {
//   const donationReqBody =
//     incomingDonation as PUTIncomingDonationRequestBodyType;

//   // Validations
//   if (incomingDonation.id < 0) {
//     throw new Error("DonationId must be a non-negative integer");
//   }
//   console.log(incomingDonation.id, "incomingDonation.id");
//   const donationExists = await db.donation.findUnique({
//     where: { id: incomingDonation.id },
//   });

//   if (!donationExists) {
//     throw new Error("Invalid DonationID");
//   }

//   for (const donationDetail of donationReqBody.donationDetails) {
//     console.log(
//       donationDetail.usedQuantity,
//       donationDetail.newQuantity,
//       donationDetail.item,
//     );
//     console.log(donationDetail);
//     if (donationDetail.usedQuantity < 0 || donationDetail.newQuantity < 0) {
//       throw new Error("Quantity of items must be non-negative integers");
//     }

//     if (!donationDetail.item) {
//       throw new Error("Missing item name");
//     }

//     // Check if item exists in the database
//     const items = await getItemsName(donationDetail.item);

//     if (!items) {
//       throw new Error(`No item with the given name: ${donationDetail.item}`);
//     } else if (items.length > 1) {
//       throw new Error(
//         `More than one item found by the given name: ${donationDetail.item}`,
//       );
//     } else if (items.length === 1) {
//       // set itemId
//       donationDetail.itemId = items[0].id;
//     }
//   }

//   console.log("Done with validations");
//   console.log(
//     donationReqBody.donationDetails,
//     "donationReqBody.donationDetails",
//   );

//   // for loop to set donationDetail.itemId

//   // Update the DonationDetails Table and the Item Table
//   await Promise.all(
//     donationReqBody.donationDetails.map(async (donationDetail) => {
//       console.log(donationDetail);
//       const prevDonationDetail = await getDonationDetails(
//         donationExists.id,
//         donationDetail.itemId,
//       );

//       const itemFromName = await getItemsName(donationDetail.item!);

//       donationDetail.itemId = itemFromName![0].id;

//       await updateDonationDetails(donationExists.id, donationDetail);

//       await updateItem(
//         donationDetail.itemId,
//         prevDonationDetail!.usedQuantity - donationDetail.usedQuantity,
//         prevDonationDetail!.newQuantity - donationDetail.newQuantity,
//       );
//     }),
//   );
//   // return updated donation
//   return donationExists;
// };
