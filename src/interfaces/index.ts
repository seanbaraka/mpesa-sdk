/**
 * This file contains the interfaces for the Mpesa SDK. Some are derived from the Daraja API documentation, either as
 * input parameters or response objects.
 */

/**
 * The environment for the Mpesa SDK.
 * This is either: `sandbox` or `production`.
 */
export enum Environment {
  SANDBOX = "sandbox",
  PRODUCTION = "production",
}

export interface ClientConfig {
  consumerKey: string;
  consumerSecret: string;
  environment?: Environment;
  shortCode: string;
  passphrase?: string;
  passKey?: string;
}

/**
 * The response object for the authentication endpoint.
 * ```json
 * {
 *     "expires_in": "3599", // The number of seconds the access token is valid for
 *     "access_token": "MTY3NDg5NjM5NzI5NjpvT2xQdmQ6MTpjaQ", // The access token
 * }
 * ```
 */
export interface AuthResponse {
  expires_in: string;
  access_token: string;
}

/**
 * The response type for the URL registration endpoint.
 * This is either: `Completed` or `Cancelled`.
 */
export type UrlRegisterResposeType = "Completed" | "Cancelled";

export interface UrlRegisterConfig {
  ShortCode: string;
  ResponseType: UrlRegisterResposeType;
  ConfirmationURL: string;
  ValidationURL: string;
}
export interface B2CTransactionConfig {
  InitiatorName: string;
  SecurityCredential: string;
  CommandID: string;
  Amount: string;
  PartyA: string;
  PartyB: string;
  Remarks: string;
  QueueTimeOutURL: string;
  ResultURL: string;
  Occassion: string;
}
export interface AccountBalanceQueryConfig {
  CommandID?: string;
  PartyA: number;
  IdentifierType?: string;
  Remarks: string;
  Initiator: string;
  SecurityCredential: string;
  QueueTimeOutURL: string;
  ResultURL: string;
}

export interface STKQuery {
  amount: number;
  sender: string;
  reference: string;
  callbackUrl: string;
  description: string;
}
