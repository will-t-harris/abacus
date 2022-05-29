import { Request, Response } from "express";
import PlaidService from "../services/Plaid.service";
import { isString } from "../shared/utils";

export async function getLinkToken(_req: Request, res: Response) {
  const result = await PlaidService.getLinkToken();

  res.send(result);
}

export async function exchangePublicToken(req: Request, res: Response) {
  const token = req.query.token;

  if (!token || !isString(token)) {
    res.status(400).send();
  }

  const result = await PlaidService.exchangePublicToken(token as string);

  res.send(result);
}
