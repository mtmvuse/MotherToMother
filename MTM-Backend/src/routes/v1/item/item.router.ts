import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { ItemType } from "../../../types/item";
import * as ItemsService from "./item.service";

const itemsRouter = express.Router();

interface QueryType {
  category: string;
  name: string;
}

/**
 * gets an items based upon the {category, name}
 */
itemsRouter.get(
  "/v1",
  async (
    req: Request<any, any, any, QueryType>,
    res: Response,
    next: NextFunction,
  ) => {
    const category = req.query.category;
    const name = req.query.name;
    try {
      let items: ItemType[] | null;
      if (!category && !name) {
        items = await ItemsService.getAllItems();
      } else if (category && !name) {
        items = await ItemsService.getItemsCategory(category);
      } else if (!category && name) {
        items = await ItemsService.getItemsName(name);
      } else {
        items = await ItemsService.getItemsCategoryName(category, name);
      }
      return res.status(200).json(items);
    } catch (e) {
      next(e);
    }
  },
);

export { itemsRouter };
