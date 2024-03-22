import { db } from "../../../utils/db.server";
import type {
  DonationType,
  DonationDetailType,
  OutgoingDonationStatsType,
  DonationsDashboardDisplay,
} from "../../../types/donation";
import type { Prisma } from "@prisma/client";

export const getDonationsAP = async (
  page: number,
  pageSize: number,
  whereClause: Prisma.donation_detailWhereInput,
  orderBy: Prisma.DonationDetailOrderByWithRelationInput,
): Promise<DonationsDashboardDisplay[]> => {
  const donationDetails = await db.donation_detail.findMany({
    where: whereClause,
    take: pageSize,
    skip: page * pageSize,
    orderBy: orderBy,
  });

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

export const deleteDonation = async (donationId: number) => {
  return db.donation.delete({
    where: {
      id: donationId,
    },
  });
};
