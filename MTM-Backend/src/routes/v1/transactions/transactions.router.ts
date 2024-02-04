import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as TransactionsServices from "./transactions.service";

interface QueryType {
  page: string;
  pageSize: string;
}

const transactionsRouter = express.Router();

transactionsRouter.get(
  "/v1",
  async (
    req: Request<any, any, any, QueryType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page, 10);
      const pageSize = parseInt(req.query.pageSize, 10);
      if (!page || !pageSize || page <= 0 || pageSize <= 0) {
        return res.status(400).json({
          error: "Page and pageSize must be entered and greater than 0",
        });
      }
      const transaction = await TransactionsServices.getTransactions(
        page,
        pageSize,
      );
      return res.status(200).json(transaction);
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

export { transactionsRouter };
