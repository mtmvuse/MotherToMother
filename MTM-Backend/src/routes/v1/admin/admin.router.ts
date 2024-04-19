import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { AdminInputNoID } from "../../../types/admin";
import * as AdminService from "./admin.service";
import Joi from "joi";

const adminsRouter = express.Router();

/**
 * post an admin based upon the {name, email, role}
 */
adminsRouter.post(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      role: Joi.string().required(),
      currentUser: Joi.string(),
    });
    try {
      const data = (await schema.validateAsync(req.body)) as AdminInputNoID;
      const item = await AdminService.createAdmin(data);
      if (!item) {
        return res.status(400).json({ error: "Admin already exists" });
      }
      return res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  },
);

/**
 * put an admin based upon the email
 * @param email the email of the admin (string)
 * @body the new name and role of the admin (optional)
 * @returns an admin in the database or null if the admin does not exist.
 */
adminsRouter.put(
  "/v1/update/id/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      role: Joi.string().required(),
      email: Joi.string().required(),
      currentUser: Joi.string(),
    });
    const id = Number(req.params.id);
    try {
      const data = (await schema.validateAsync(req.body)) as AdminInputNoID;
      await AdminService.updateAdmin(data, id);
      res.status(200).send("Admin type updated successfully");
    } catch (e) {
      next(e);
    }
  },
);

adminsRouter.delete(
  "/v1/delete/id/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    try {
      const user = await AdminService.deleteAdmin(id);
      return res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },
);

export { adminsRouter };
