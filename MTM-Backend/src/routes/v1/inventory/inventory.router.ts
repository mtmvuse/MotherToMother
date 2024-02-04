import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { getInventoryByPage } from "./inventory.service";

const inventoryRouter = express.Router();

/**
 * get an inventory based upon the {page, pageSize}
 */
const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.query.page || !req.query.pageSize) {
      throw new Error("Missing page or pageSize query parameter");
    }

    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.pageSize as string);

    const inventory = await getInventoryByPage(page, pageSize);

    res.status(200).json(inventory);
  } catch (error) {
    next(error);
  }
};

inventoryRouter.get("/v1", getInventory);

export { inventoryRouter };
