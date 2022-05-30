import { Request, Response } from "express";
import PlaidService from "../services/Plaid.service";
import { isString } from "../shared/utils";
import { ExchangeTokenRequest } from "../types";

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

export async function getTransactions(req: Request, res: Response) {
  const { institutionName } = req.query;

  if (!institutionName) {
    return res.status(400).send();
  }

  const result = await PlaidService.getTransactions({
    institutionName: institutionName as string,
    startDate: "2021-01-01",
    endDate: "2022-01-01",
  });

  if (!result) {
    return res.status(404).send();
  }

  return res.send(result.data.transactions);
}

export async function getPlaidItems(_req: Request, res: Response) {
  const result = await PlaidService.getPlaidItems({ userId: 1 });

  return res.send(result);
}
