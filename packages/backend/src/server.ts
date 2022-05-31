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

const PORT = process.env.PORT || "8080";
const yogaServer = createServer({
  port: Number(process.env.PORT) || 8080,
  schema: schema,
  //TODO add user id to context
  // context: async ({ req }) => ({
  //   id: await getUserIdFromJWT(req.headers.authorization),
  // }),
});
const expressLogger = expressPino();
const app = express();

app.use("/api/graphql", yogaServer);
app.get("/health", (_req, res) => {
  res.send();
});
app.use("/api", router);

app.use(cors());
app.use(helmet());
app.use(expressLogger);
app.use(express.json());

app.listen(PORT, () => {
  logger.info(`Server listening at port ${PORT}.`);
  logger.info(`GraphQL API available at <host>:${PORT}/api/graphql`);
});
