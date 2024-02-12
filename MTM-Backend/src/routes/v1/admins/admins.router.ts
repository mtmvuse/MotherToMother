import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { AdminInputNoID, AdminType } from "../../../types/admin";
import * as AdminService from "./admins.service";
import Joi from "joi";

interface QueryType {
  email: string;
  page: number;
  pageSize: number;
}

const adminsRouter = express.Router();

/**
 * get an admin based upon the {email}
 */
adminsRouter.get(
  "/v1",
  async (
    req: Request<any, any, any, QueryType>,
    res: Response,
    next: NextFunction,
  ) => {
    const email = req.query.email;
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    // query for all admins for user dashboard
    console.log(email, page, pageSize);
    if (!email && page !== undefined && pageSize) {
      const admins = AdminService.getAllAdmins(page, pageSize);
      const totalNumber = AdminService.getAdminCount();
      return res.status(200).json({ admins, totalNumber });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    try {
      const admin: AdminType | null = await AdminService.getAdminEmail(email);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      return res.status(200).json(admin);
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

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
    });
    try {
      const data = (await schema.validateAsync(req.body)) as AdminInputNoID;
      const item = await AdminService.createAdmin(data);
      if (!item) {
        return res.status(400).json({ error: "Admin already exists" });
      }
      return res.status(201).json(item);
    } catch (e) {
      console.error(e);
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
  "/v1",
  async (
    req: Request<any, any, any, QueryType>,
    res: Response,
    next: NextFunction,
  ) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      role: Joi.string().required(),
    });

    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const data = (await schema.validateAsync(req.body)) as AdminInputNoID;
      data.email = email;
      await AdminService.updateAdmin(data);

      res.status(200).send("Admin type updated successfully");
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

export { adminsRouter };
