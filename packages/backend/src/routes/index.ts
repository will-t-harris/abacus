import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as plaidController from "../controllers/plaid.controller.js";
import * as authController from "../controllers/auth.controller.js";

export const router = express.Router();

router.use(authMiddleware);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/token", plaidController.getLinkToken);

router.post("/token", plaidController.exchangePublicToken);
