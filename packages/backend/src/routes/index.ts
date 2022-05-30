import express from "express";
import prisma from "../prismaClient";
import * as plaidController from "../controllers/plaid.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as authController from "../controllers/auth.controller";

export const router = express.Router();

router.use(authMiddleware);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/all-users", async (_req, res) => {
  const allUsers = await prisma.user.findMany();

  res.send(allUsers);
});

router.get("/token", plaidController.getLinkToken);

router.post("/token", plaidController.exchangePublicToken);

router.get("/transactions", plaidController.getTransactions);

router.get("/items", plaidController.getPlaidItems);
