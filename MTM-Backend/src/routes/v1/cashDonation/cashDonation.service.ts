import { db } from "../../../utils/db.server";
import type {
  ResponseCashDonation,
  CashDonationInput,
} from "../../../types/cashDonation";
import type { cdDashboardDisplay } from "../../../types/cashDonation";
import { type Prisma } from "@prisma/client";

export const deleteCashDonation = async (id: number): Promise<void> => {
  try {
    await db.cashDonation.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const updateCashById = async (
  cash: CashDonationInput,
  id: number,
): Promise<ResponseCashDonation> => {
  return db.cashDonation.update({
    where: {
      id: id,
    },
    data: cash,
    select: {
      id: true,
      date: true,
      total: true,
    },
  });
};

export const getCashDonations = async (): Promise<ResponseCashDonation[]> => {
  return db.cashDonation.findMany({
    select: {
      id: true,
      date: true,
      total: true,
      Organization: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const createCashDonation = async (
  input: CashDonationInput,
): Promise<ResponseCashDonation> => {
  try {
    const newDonation = await db.cashDonation.create({
      data: {
        organizationId: input.organizationId,
        date: input.date,
        total: input.total,
      },
    });

    return {
      id: newDonation.id,
      date: newDonation.date,
      total: newDonation.total,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create cash donation");
  }
};

export const getCdAP = async (
  page: number,
  pageSize: number,
  whereClause: cdDashboardDisplay,
  orderBy: Prisma.cashDonation_dashboardAvgOrderByAggregateInput,
): Promise<cdDashboardDisplay[]> => {
  return db.cashDonation_dashboard.findMany({
    where: whereClause,
    take: pageSize,
    skip: page * pageSize,
    orderBy: orderBy,
  });
};

export const getAllCdAP = async (
  whereClause: cdDashboardDisplay,
  orderBy: Prisma.cashDonation_dashboardAvgOrderByAggregateInput,
): Promise<cdDashboardDisplay[]> => {
  return db.cashDonation_dashboard.findMany({
    where: whereClause,
    orderBy: orderBy,
  });
};

export const getCdCount = async (
  whereClause: cdDashboardDisplay,
): Promise<number> => {
  return db.cashDonation_dashboard.count({
    where: whereClause,
  });
};
