import { Request, Response } from "express";
import PlaidService from "../services/Plaid.service.js";
import { isString } from "../shared/utils.js";
import { ExchangeTokenRequest } from "../types/index.js";

export async function getLinkToken(_req: Request, res: Response) {
  const result = await PlaidService.getLinkToken();

  return res.send(result);
}

export async function exchangePublicToken(
  req: ExchangeTokenRequest,
  res: Response
) {
  const { publicToken, institutionName } = req.body;

  if (!publicToken || !isString(publicToken)) {
    return res.status(400).send();
  }

  const result = await PlaidService.exchangePublicToken({
    publicToken: publicToken,
    institutionName: institutionName,
    userId: req.user.id,
  });

  return res.send(result);
}

export async function getPlaidItems(_req: Request, res: Response) {
  const result = await PlaidService.getPlaidItems({ userId: 1 });

  return res.send(result);
}
