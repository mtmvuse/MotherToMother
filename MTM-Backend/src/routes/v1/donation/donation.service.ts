import { db } from "../../../utils/db.server";
import type {
  DonationType,
  DonationDetailType,
  OutgoingDonationStatsType,
  DashboardDonationDetailType,
  IncomingDonationTypeWithID,
  IncomingDonationWithIDType,
} from "../../../types/donation";

export const getTotalNumberDonations = async () => {
  return db.donation.count();
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

<<<<<<< HEAD
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
=======
export const createIncomingDonation = async (
  incomingDonation: IncomingDonationTypeWithID,
) => {
  const user = await db.user.findUnique({
    where: {
      id: incomingDonation.userId,
    },
  });
  if (!user) {
    return null;
  }
  const donation = await db.donation.create({
    data: {
      userId: incomingDonation.userId,
      date: new Date(),
    },
  });
  // For each product, update the inventory and create donation details entries
  for (const product of incomingDonation.products) {
    const item = await db.item.findFirst({
      where: { name: product.name },
      select: {
        id: true,
        category: true,
        name: true,
        quantityUsed: true,
        quantityNew: true,
        valueUsed: true,
        valueNew: true,
        DonationDetail: true,
      },
    });
    if (item) {
      await db.item.update({
        where: { id: item.id },
        data: { quantityNew: { increment: product.quantity } },
      });
      await db.donationDetail.create({
        data: {
          donationId: donation.id,
          itemId: item.id,
          newQuantity: product.quantity,
          usedQuantity: 0,
        },
      });
    } else {
      // Handle the case where the item does not exist
      // Create a new item and donation details entry
      const newItem = await db.item.create({
        data: {
          category: "TBD",
          name: product.name,
          quantityUsed: 0,
          quantityNew: product.quantity,
          valueUsed: 0,
          valueNew: 0,
        },
      });
      await db.donationDetail.create({
        data: {
          donationId: donation.id,
          itemId: newItem.id,
          newQuantity: product.quantity,
          usedQuantity: 0,
        },
      });
    }
  }
  return donation;
};

export const updateIncomingDonation = async (
  incomingDonation: IncomingDonationWithIDType,
) => {
  const donationExists = await db.donation.findUnique({
    where: { id: incomingDonation.id },
  });

  if (!donationExists) {
    return null;
  }

  // Process each donation detail
  for (const detail of incomingDonation.donationDetails) {
    // find and Update the corresponding item's inventory
    const item = await db.item.findFirst({
      where: { name: detail.item },
      select: {
        id: true,
        quantityUsed: true,
        quantityNew: true,
      },
    });
    if (item) {
      await db.item.update({
        where: { id: item.id },
        data: {
          quantityNew: { increment: detail.newQuantity },
          quantityUsed: { increment: detail.usedQuantity },
        },
      });
    } else {
      // Handle the case where the item does not exist
      // Create a new item and donation details entry
      const newItem = await db.item.create({
        data: {
          category: "TBD",
          name: detail.item,
          quantityUsed: detail.usedQuantity,
          quantityNew: detail.newQuantity,
          valueUsed: 0,
          valueNew: 0,
        },
      });
      await db.donationDetail.create({
        data: {
          donationId: incomingDonation.id,
          itemId: newItem.id,
          newQuantity: detail.newQuantity,
          usedQuantity: detail.usedQuantity,
        },
      });
    }
  }
  // return updated donation
  return donationExists;
};
