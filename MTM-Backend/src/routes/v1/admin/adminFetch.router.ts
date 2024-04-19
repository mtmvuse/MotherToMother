import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { AdminType } from "../../../types/admin";
import * as AdminService from "./admin.service";

interface QueryType {
  email: string;
  page: number;
  pageSize: number;
}

const adminsFetchRouter = express.Router();

/**
 * get an admin based upon the {email}
 */
adminsFetchRouter.get(
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
    if (!email && page !== undefined && pageSize) {
      const admins = await AdminService.getAllAdmins(page, pageSize);
      const totalNumber = await AdminService.getAdminCount();
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
      next(e);
    }
  },
);

export { adminsFetchRouter };
