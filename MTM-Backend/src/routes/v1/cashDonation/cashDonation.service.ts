import { db } from "../../../utils/db.server";
import type {
  ResponseCashDonation,
  CashDonationInput,
} from "../../../types/cashDonation";
/**
 * get all cashDonations in the db
 * @returns all cashDonations in the database
 */
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

    // Return the relevant fields of the created cash donation
    return {
      id: newDonation.id,
      date: newDonation.date,
      total: newDonation.total,
      organization: input.organization,
    };
  } catch (error) {
    // Handle any errors that occur during the creation of the cash donation
    console.error(error);
    throw new Error("Failed to create cash donation");
  }
};
