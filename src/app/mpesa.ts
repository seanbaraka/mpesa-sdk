import dayjs from "dayjs";
import {
  AccountBalanceQueryConfig,
  AuthResponse,
  B2CTransactionConfig,
  ClientConfig,
  DynamicQRCodeQuery,
  DynamicQRCodeResponse,
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

    const data: AuthResponse = await response.json();
    this.token = data.access_token;
    return data;
  }

  /**
   * C2B Operations
   */

  // 1. Register confirmation and validation urls
  async registerUrls(registerParams: UrlRegisterConfig) {
    const response = await fetch(`${this.BASE_URL}/mpesa/c2b/v2/registerurl`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }

  async B2C(b2cTransaction: B2CTransactionConfig) {
    const response = await fetch(
      `${this.BASE_URL}/mpesa/b2c/v1/paymentrequest`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(b2cTransaction),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }

  async getAccountBalance(balanceQuery: AccountBalanceQueryConfig) {
    balanceQuery.CommandID = "AccountBalance"; // explicitly set this to accountbalance
    // identifier types 1 – MSISDN, 2 – Till Number, 4 – Organization short code
    balanceQuery.IdentifierType = "4";
    try {
      const response = await fetch(
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

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  }

  async sendSTKPush(stkQuery: STKQuery) {
    // YYYYMMDDHHmmss
    const { amount, sender, callbackUrl, reference, description } = stkQuery;
    const now = Date.now();
    const timestamp = dayjs(now).format("YYYYMMDDHHmmss");
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

  async generateDynamicQRCode(
    dynamicQRCodeQuery: DynamicQRCodeQuery
  ): Promise<DynamicQRCodeResponse> {
    const response = await fetch(`${this.BASE_URL}/mpesa/qrcode/v1/generate`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dynamicQRCodeQuery),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: DynamicQRCodeResponse = await response.json();
    return data;
  }
}
