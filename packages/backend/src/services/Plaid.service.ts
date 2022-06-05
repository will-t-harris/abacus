import {
  AccountsGetRequest,
  Configuration,
  CountryCode,
  ItemPublicTokenExchangeRequest,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Products,
  TransactionsGetRequest,
} from "plaid";
import prisma from "../prismaClient.js";

const {
  PLAID_ENV,
  PLAID_CLIENT_ID,
  PLAID_SECRET_SANDBOX,
  PLAID_SECRET_DEVELOPMENT,
} = process.env;

const PLAID_SECRET =
  PLAID_ENV === "development" ? PLAID_SECRET_DEVELOPMENT : PLAID_SECRET_SANDBOX;

class PlaidService {
  client: PlaidApi;

  constructor() {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[PLAID_ENV ?? ""],
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
          "PLAID-SECRET": PLAID_SECRET,
          "Plaid-Version": "2020-09-14",
        },
      },
    });

    this.client = new PlaidApi(configuration);
  }

  public async getLinkToken() {
    const request: LinkTokenCreateRequest = {
      client_name: "finance-server",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
      user: {
        client_user_id: "123",
      },
    };

    const response = await this.client.linkTokenCreate(request);
    const token = response.data.link_token;

    return { token: token };
  }

  public async exchangePublicToken({
    publicToken,
    institutionName,
    userId,
  }: {
    publicToken: string;
    institutionName: string;
    userId: number;
  }) {
    const request: ItemPublicTokenExchangeRequest = {
      public_token: publicToken,
    };

    const result = await this.client.itemPublicTokenExchange(request);

    await prisma.plaidItem.create({
      data: {
        institutionName: institutionName,
        itemId: result.data.item_id,
        accessToken: result.data.access_token,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return { accessToken: result.data.access_token };
  }

  public async getPlaidItems({ userId }: { userId: number }) {
    return await prisma.plaidItem.findMany({
      where: { userId: userId },
    });
  }

  public async getAccountsForItem({ accessToken }: { accessToken: string }) {
    const request: AccountsGetRequest = {
      access_token: accessToken,
    };

    const {
      data: { accounts },
    } = await this.client.accountsGet(request);

    return accounts;
  }

  public async getTransactions({
    accessToken,
    startDate,
    endDate,
  }: {
    accessToken: string;
    startDate: string;
    endDate: string;
  }) {
    const request: TransactionsGetRequest = {
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const result = await this.client.transactionsGet(request);

      console.log("RESULT: ", result);

      return result;
    } catch (error) {
      console.error("ERROR: ", error);
      return;
    }
  }
}

export default new PlaidService();
