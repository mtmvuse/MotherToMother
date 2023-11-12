import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { exampleRoute } from "./routes/exampleRoute";
import { userRouter } from "./routes/v1/user/user.router";
import { sessionRouter } from "./routes/v1/session/session.router";
import { verifyToken } from "./middlewares/verifyToken";
import { notFound, errorHandler } from "./middlewares/errors";
import { donationRouter } from "./routes/v1/donation/donation.router";

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
app.use("/example", verifyToken, exampleRoute);
// app.use("/example", exampleRoute);
// app.use("/users", verifyToken, userRouter);
// app.use("/users", userRouter);

app.use("/donation", donationRouter); // Unprotected, Removed verifyToken

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
