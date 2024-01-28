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

  const transformedData = donations.map((transaction) => {
    const details = transaction.DonationDetail.reduce(
      (
        acc: {
          amount: number;
          items: { product: string; category: string; status: string }[];
        },
        detail,
      ) => {
        acc.amount +=
          detail.item.valueUsed * detail.usedQuantity +
          detail.item.valueNew * detail.newQuantity;
        acc.items.push({
          product: detail.item.name,
          category: detail.item.category,
          status: detail.usedQuantity > 0 ? "Used" : "New",
        });
        return acc;
      },
      { amount: 0, items: [] },
    );

    return {
      orderId: transaction.id,
      items: details.items,
      organization: transaction.user.Organization?.name || "Individual",
      amount: details.amount,
    };
  });
  return transformedData;
};

// TODO: add date, type - incoming (public, corporate) outgoing (to the agency - look at organization type)
// [order_id, product, category, organization, amount, date, status]
