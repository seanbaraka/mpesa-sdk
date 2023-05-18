import dayjs from "dayjs";
import {
  AccountBalanceQueryConfig,
  AuthResponse,
  B2CTransactionConfig,
  ClientConfig,
  STKQuery,
  UrlRegisterConfig,
} from "../interfaces";
import axios from "axios";

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
    axios.defaults.baseURL = this.BASE_URL;
  }

  /**
   * Retrieves an access token with a set expiry date
   * @returns
   */
  async getAccessToken(): Promise<AuthResponse> {
    const req = await axios.get(
      `/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${this.config.consumerKey}:${this.config.consumerSecret}`
            ).toString("base64"),
        },
      }
    );
    const { access_token } = req.data;
    this.token = access_token;
    return req.data;
  }

  /**
   * C2B Operations
   */

  // 1. Register confirmation and validation urls
  async registerUrls(registerParams: UrlRegisterConfig) {
    const req = await axios.post(`/mpesa/c2b/v2/registerurl`, registerParams, {
      headers: { Authorization: "Bearer " + this.token },
    });
    return req.data;
  }

  async B2C(b2cTransaction: B2CTransactionConfig) {
    const req = await axios.post(
      `/mpesa/b2c/v1/paymentrequest`,
      b2cTransaction,
      {
        headers: { Authorization: "Bearer " + this.token },
      }
    );
    return req.data;
  }

  async getAccountBalance(balanceQuery: AccountBalanceQueryConfig) {
    balanceQuery.CommandID = "AccountBalance"; // explicitly set this to accountbalance
    // identifier types 1 – MSISDN, 2 – Till Number, 4 – Organization short code
    balanceQuery.IdentifierType = "4";
    try {
      const req = await axios.post(
        `/mpesa/accountbalance/v1/query`,
        balanceQuery,
        {
          headers: { Authorization: "Bearer " + this.token },
        }
      );
      if (req.status == 200) {
        return req.data;
      }
    } catch (err) {
      throw err;
    }
  }

  async sendSTKPush(stkQuery: STKQuery) {
    // YYYYMMDDHHmmss
    const { amount, sender, callbackUrl, reference, description } = stkQuery;
    const now = Date.now();
    const timestamp = dayjs(now).format("YYYYMMDDHHmmss");
    const passkey =
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const password = Buffer.from(
      `${this.config.shortCode}+${passkey}+${timestamp}`
    );
    try {
      const request = await axios.post(
        "/mpesa/stkpush/v1/processrequest",
        {
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
        },
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
      if (request.status == 200) {
        return request.data;
      }
    } catch (error) {
      throw error;
    }
  }
}
