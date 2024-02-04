import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
// import type { AdminInputNoID, AdminType } from "../../../types/transactions";
import * as TransactionsServices from "./transactions.service";

const transactionsRouter = express.Router();

/**
 * get an admin based upon the {email}
 */
transactionsRouter.get(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await TransactionsServices.getTransactions();
      return res.status(200).json(transaction);
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

export { transactionsRouter };
