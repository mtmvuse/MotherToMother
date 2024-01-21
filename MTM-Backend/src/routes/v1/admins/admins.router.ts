import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { AdminType } from "../../../types/admin";
import * as AdminService from "./admins.service";
import Joi from "joi";

interface QueryType {
  email: string;
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
      next(e);
    }
  },
);
