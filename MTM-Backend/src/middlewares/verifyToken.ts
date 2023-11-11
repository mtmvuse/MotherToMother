// Imports the Firebase auth
// Splits the authorization header ("Bearer <token>")
// into an array and takes the second element, which is the token
import { type Request, type Response, type NextFunction } from "express";
import type { SessionUser } from "../types/session";
import type { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../../config/firebase-config";

interface VerifyTokenRequest extends Request {
  body: {
    sessionUser: SessionUser;
  };
}
interface DecodedIdWithUserType extends DecodedIdToken {
  userType: string;
}
export const verifyToken = async (
  req: VerifyTokenRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Token not found");
    }

    // Verifies the token and decodes it to get associated user data
    // and stores it in req.body.user to be accessed by other routes
    const decodeValue = (await auth.verifyIdToken(
      token,
    )) as DecodedIdWithUserType;

    if (!decodeValue) {
      throw new Error("Token verification failed");
    }

    req.body.sessionUser = {
      uid: decodeValue.uid,
      email: decodeValue.email,
      userType: decodeValue.userType,
    } as SessionUser;
    next();
  } catch (e) {
    next(e); // Pass the error to Express error-handling middleware
  }
};
