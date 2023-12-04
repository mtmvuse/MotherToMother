import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as OrganizationService from "./organization.service";
const organizationRouter = express.Router();

interface QueryType {
  type: string;
}

/**
 * get array of organizations based on query parameter
 * if type is undefined return all organizations
 * else return organizations with the matching type
 */
organizationRouter.get(
  "/v1",
  async (
    req: Request<any, any, any, QueryType>,
    res: Response,
    next: NextFunction,
  ) => {
    const organizationType = req.query.type;
    try {
      if (organizationType == undefined) {
        const organizations = await OrganizationService.getOrganizations();
        return res.status(200).json(organizations);
      } else {
        const organizations =
          await OrganizationService.getOrganizationsByType(organizationType);
        return res.status(200).json(organizations);
      }
    } catch (e) {
      next(e);
    }
  },
);

export { organizationRouter };
