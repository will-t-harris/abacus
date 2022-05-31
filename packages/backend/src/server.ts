import { createServer } from "@graphql-yoga/node";
import express from "express";
import helmet from "helmet";
import "dotenv/config";
import cors from "cors";
import expressPino from "express-pino-logger";

import { logger } from "./logger.js";
import { router } from "./routes/index.js";
import { schema } from "./graphql/schema.js";

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

const yogaServer = createServer({
  port: Number(process.env.PORT) || 8080,
  schema: schema,
});

const app = express();
const PORT = process.env.PORT || "8080";
const expressLogger = expressPino();

app.use("/graphql", yogaServer);

app.use(cors());
app.use(helmet());
app.use(expressLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.send();
});

app.use("/api", router);

app.listen(PORT, () => {
  logger.info(`Server listening at port ${PORT}.`);
});
