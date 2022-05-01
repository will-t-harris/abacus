import express from "express";
import helmet from "helmet";
import "dotenv/config";
import cors from "cors";
import expressPino from "express-pino-logger";

import { logger } from "./logger";
import { router } from "./routes";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        email: string;
        name: string | null;
      };
    }
  }
}

const app = express();
const PORT = process.env.PORT || "8080";
const expressLogger = expressPino();

app.use(cors());
app.use(helmet());
app.use(expressLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.send();
});

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  app.listen(PORT, () => {
    logger.info(`Server listening at port ${PORT}.`);
  });
}

// Run the app with vite if not in production
// If there were a staging deployment, we'd want
// to not use vite for that either.
export const viteNodeApp = app;
