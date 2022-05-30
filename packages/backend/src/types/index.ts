import { Request } from "express";

export interface ExchangeTokenRequest extends Request {
  body: {
    publicToken: string;
    institutionName: string;
  };
}
