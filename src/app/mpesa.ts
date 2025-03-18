import {
  AccountBalanceQueryConfig,
  AuthResponse,
  B2CTransactionConfig,
  ClientConfig,
  STKQuery,
  UrlRegisterConfig,
} from "../interfaces";

export class Mpesa {
  // declare the configurations passed when creating the client
  private readonly config: ClientConfig;
  private BASE_URL: string;
  private token: string | undefined;

  constructor(configs: ClientConfig) {
    configs.environment !== "production"
      ? (this.BASE_URL = "https://sandbox.safaricom.co.ke")
      : (this.BASE_URL = "https://api.safaricom.co.ke");
    this.config = configs;
  }

  /**
   * Retrieves an access token with a set expiry date
   * @returns
   */
  async getAccessToken(): Promise<AuthResponse> {
    const response = await fetch(
      `${this.BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: "GET",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${this.config.consumerKey}:${this.config.consumerSecret}`
            ).toString("base64"),
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    this.token = data.access_token;
    return data;
  }

  /**
   * C2B Operations
   */

  // 1. Register confirmation and validation urls
  async registerUrls(registerParams: UrlRegisterConfig) {
    const req = await fetch(`${this.BASE_URL}/mpesa/c2b/v1/registerurl`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerParams),
    });
    if (!req.ok) {
      throw new Error(`HTTP error in registering you! Status: ${req.status}`);
    }
    const response = await req.json();
    return response;
  }
  async B2C(b2cTransaction: B2CTransactionConfig) {
    const req = await fetch(`${this.BASE_URL}/mpesa/b2c/v3/paymentrequest`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(b2cTransaction),
    });
    if (!req.ok) {
      throw new Error(`HTTP error in B2C transaction! Status: ${req.status}`);
    }
    const response = await req.json();
    return response;
  }

  async getAccountBalance(balanceQuery: AccountBalanceQueryConfig) {
    balanceQuery.CommandID = "AccountBalance"; // explicitly set this to accountbalance
    // identifier types 1 – MSISDN, 2 – Till Number, 4 – Organization short code
    balanceQuery.IdentifierType = "4";
    try {
      const req = await fetch(
        `${this.BASE_URL}/mpesa/accountbalance/v1/query`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + this.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(balanceQuery),
        }
      );
      if (!req.ok) {
        throw new Error(
          `HTTP error in finding account balance! Status: ${req.status}`
        );
      }

      const response = await req.json();
      return response;
    } catch (err) {
      throw err;
    }
  }

  async sendSTKPush(stkQuery: STKQuery) {
    // YYYYMMDDHHmmss
    const { amount, sender, callbackUrl, reference, description } = stkQuery;
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
      now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
      now.getSeconds()
    ).padStart(2, "0")}`;
    const passkey = this.config.passKey;
    const password = Buffer.from(
      `${this.config.shortCode}${passkey}${timestamp}`
    ).toString("base64");
    try {
      const response = await fetch(
        `${this.BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            BusinessShortCode: this.config.shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: sender,
            PartyB: this.config.shortCode,
            PhoneNumber: sender,
            CallBackURL: callbackUrl,
            AccountReference: reference,
            TransactionDesc: description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
