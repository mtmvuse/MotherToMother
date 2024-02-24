import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as CashDonationService from "../cashDonation/cashDonation.service"; // Import your CashDonationService module
import Joi from "joi";
import type { CashDonationInput } from "../../../types/cashDonation";

const cashDonationRouter = express.Router();

cashDonationRouter.get("/v1", async (req, res, next) => {
  try {
    const cashDonations = await CashDonationService.getCashDonations();
    res.status(200).json(cashDonations);
  } catch (error) {
    next(error);
  }
});

// Route handler for adding a cash donation
cashDonationRouter.post(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      organizationId: Joi.number().integer().positive(),
      date: Joi.date().iso().required(),
      total: Joi.number().positive().required(),
    });
    try {
      // Validate the request body against the schema
      const validatedData = (await schema.validateAsync(
        req.body,
      )) as CashDonationInput;

      // Call the service function to add the cash donation
      const result =
        await CashDonationService.createCashDonation(validatedData);

      // Return the result with status 201 (Created)
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
);

export { cashDonationRouter };
