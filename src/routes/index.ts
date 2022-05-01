import express from "express";
import * as plaidController from "../controllers/plaid.controller.js";

export const router = express.Router();

router.get("/link", plaidController.getLinkToken);

router.post("/token", plaidController.exchangePublicToken);
