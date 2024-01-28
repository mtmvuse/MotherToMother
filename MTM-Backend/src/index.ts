import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { userRouter } from "./routes/v1/user/user.router";
import { sessionRouter } from "./routes/v1/session/session.router";
import { itemsRouter } from "./routes/v1/item/item.router";
import { verifyToken } from "./middlewares/verifyToken";
import { notFound, errorHandler } from "./middlewares/errors";
import { donationRouter } from "./routes/v1/donation/donation.router";
import { registrationRouter } from "./routes/v1/registration/registration.router";
import { organizationRouter } from "./routes/v1/organization/organization.router";
import { adminsRouter } from "./routes/v1/admins/admins.router";
import { transactionsRouter } from "./routes/v1/transactions/transactions.router";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Allow cross-origin requests (for frontend to communicate with backend on different ports/address)
app.use(express.json()); // Parses incoming JSON requests and uts the parsed data in req
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with urlenconded payloads
// error handling and better logging
app.use(morgan("dev"));
app.use(helmet());

/**
 * Uses the verifyToken middleware to protect the "/data" route
 * Use the verifyToken to protect all the routes that require authentication
 */
app.use("/sessions", sessionRouter);

app.use("/users", verifyToken, userRouter);

app.use("/admins", verifyToken, adminsRouter);

app.use("/items", verifyToken, itemsRouter);

app.use("/registration", registrationRouter);

app.use("/organization", organizationRouter);

app.use("/donation", verifyToken, donationRouter);

// TODO: Add verifyToken to protect the "/transactions" route
app.use("/transactions", transactionsRouter);

// Default route: Unprotected
app.get("/", (_req: Request, res: Response) => {
  res.send("MTM Server");
});

// error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
