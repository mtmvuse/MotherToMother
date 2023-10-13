import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { dataRoute } from "./routes/dataRoute";
import { verifyToken } from "./middlewares/verifyToken";
import { notFound, errorHandler } from "./middlewares/errors";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow cross-origin requests (for frontend to communicate with backend on different ports/address)
app.use(express.json()); // Parses incoming JSON requests and uts the parsed data in req
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with urlenconded payloads
// error handling and better logging
app.use(morgan("dev"));
app.use(helmet());

/**
 * Uses the verifyToken middleware to protect the data route
 * Use the verifyToken to protect all routes that require authentication
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use("/data", verifyToken, dataRoute);

app.get("/", (_req: Request, res: Response) => {
  // Default route: Unprotected
  res.send("Express + Typescript Auth Server Temp!");
});

// error handling route
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
