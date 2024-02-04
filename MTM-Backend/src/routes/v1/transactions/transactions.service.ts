import { db } from "../../../utils/db.server";

export const getTransactions = async () => {
  const donations = await db.donation.findMany({
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
    const details = donation.DonationDetail.map((detail) => ({
      item: detail.item.name,
      status: detail.usedQuantity > 0 ? "Used" : "New",
      value:
        detail.usedQuantity > 0 ? detail.item.valueUsed : detail.item.valueNew,
      quantity:
        detail.usedQuantity > 0 ? detail.usedQuantity : detail.newQuantity,
      total:
        detail.usedQuantity * detail.item.valueUsed +
        detail.newQuantity * detail.item.valueNew,
    }));

    const total = details.reduce((acc, detail) => acc + detail.total, 0);

    return {
      id: donation.id,
      date: donation.date,
      organization: donation.user.Organization?.name || "Individual",
      total: total,
      items: details.length,
      type: donation.user.Organization
        ? donation.user.Organization.type
        : "Individual",
      details: details,
    };
  });

  return transformedData;
};

// TODO: add date, type - incoming (public, corporate) outgoing (to the agency - look at organization type)
// [order_id, product, category, organization, amount, date, status]
// look at the updated body
// TOOD: req. queries: page, pageSize.
// response body: [{id, date, organization, total, items, type, details: [{item, status, value, quantity, total}]]
