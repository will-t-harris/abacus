import {
  Configuration,
  CountryCode,
  ItemPublicTokenExchangeRequest,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";

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

  public async exchangePublicToken(token: string) {
    const request: ItemPublicTokenExchangeRequest = {
      public_token: token,
    };

    const result = await this.client.itemPublicTokenExchange(request);

    return { accessToken: result.data.access_token };
  }
}

export default new PlaidService();
