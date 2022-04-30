import express from "express";
import helmet from "helmet";
import "dotenv/config";
import cors from "cors";

import { logger } from "./logger";
import { router } from "./routes/routes";

const app = express();

app.use(helmet());
app.use(cors());

app.use("/api", router);

app.get("/health", (_req, res) => {
  res.send();
});

const PORT = process.env.PORT || "8080";

if (process.env.NODE_ENV === "production") {
  app.listen(PORT, () => {
    logger.info(`Server listening at port ${PORT}.`);
  });
}

// Run the app with vite if not in production
// If there were a staging deployment, we'd want
// to not use vite for that either.
export const viteNodeApp = app;
