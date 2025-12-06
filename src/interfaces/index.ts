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

/**
 * This query enables you to generate a dynamic QR code for accepting payments
 */
export interface DynamicQRCodeQuery {
  MerchantName: string;
  RefNo: string;
  Amount: number;
  TrxCode: string;
  CPI: string;
  Size: string;
}

/**
 * The response object for the dynamic QR code endpoint.
 * ### Example Response
 * ```json
 * {
 *     "ResponseCode": "AG_20191219_000043fdf61864fe9ff5",
 *     "RequestID": "16738-27456357-1",
 *     "ResponseDescription": "QR Code Successfully Generated.",
 *     "QRCode": "iVBORw0KGgoAAAANSUhEUgAAASwAAAEsl..."
 * }
 * ```
 */
export interface DynamicQRCodeResponse {
  ResponseCode: string;
  RequestID: string;
  ResponseDescription: string;
  QRCode: string;
}

/**
 * This query enables you to query the status of a transaction
 * ### Example Query
 * ```json
 * {
 *     "Initiator": "testapiuser",
 *     "SecurityCredential": "ClONZiMYBpc65lmpJ7nvnrDmUe0WvHvA5QbOsPjEo92B6IGFwDdvdeJIFL0kgwsEKWu6SQKG4ZZUxjC",
 *     "TransactionID": "NEF61H8J60",
 *     "OriginalConversationID": "7071-4170-a0e5-8345632bad442144258",
 *     "PartyA": "600782",
 *     "IdentifierType": "4",
 *     "ResultURL": "http://myservice:8080/transactionstatus/result",
 *     "QueueTimeOutURL": "http://myservice:8080/timeout",
 *     "Remarks": "OK",
 *     "Occasion": "OK"
 * }
 * ```
 */
export interface TransactionStatusQuery {
  Initiator: string;
  SecurityCredential: string;
  TransactionID: string;
  OriginalConversationID: string;
  PartyA: string;
  IdentifierType: string;
  ResultURL: string;
  QueueTimeOutURL: string;
  Remarks: string;
  Occasion: string;
}

/**
 * The response object for the transaction status endpoint.
 * ### Example Response
 * ```json
 * {
 *     "OriginatorConversationID": "1236-7134259-1",
 *     "ConversationID": "AG_20210709_1234409f86436c583e3f",
 *     "ResponseCode": "0",
 *     "ResponseDescription": "Accept the service request successfully."
 * }
 * ```
 */
export interface APIResponseSuccessType {
  OriginatorConversationID: string;
  ConversationID: string;
  ResponseCode: string;
  ResponseDescription: string;
}

/**
 * This query enables you to initiate a reversal of a transaction
 * ### Example Query
 * ```json
 * {
 *     "Initiator": "apiop37",
 *     "SecurityCredential": "jUb+dOXJiBDui8FnruaFckZJQup3kmmCH5XJ4NY/Oo3KaUTmJbxUiVgzBjqdL533u5Q435MT2VJwr/ /1fuZvA===",
 *     "CommandID": "TransactionReversal",
 *     "TransactionID": "PDU91HIVIT",
 *     "Amount": "200",
 *     "ReceiverParty": "603021",
 *     "RecieverIdentifierType": "11",
 *     "ResultURL": "https://mydomain.com/reversal/result",
 *     "QueueTimeOutURL": "https://mydomain.com/reversal/queue",
 *     "Remarks": "Payment reversal"
 * }
 * ```
 */
export interface InitiateReversalQuery {
  Initiator: string;
  SecurityCredential: string;
  CommandID: string;
  TransactionID: string;
  Amount: string;
  ReceiverParty: string;
  RecieverIdentifierType: string;
  ResultURL: string;
  QueueTimeOutURL: string;
  Remarks: string;
}

export interface RemittTaxQuery {
  Initiator: string;
  SecurityCredential: string;
  CommandID: string;
  SenderIdentifierType: string;
  RecieverIdentifierType: string;
  Amount: string;
  PartyA: string;
  PartyB: string;
  AccountReference: string;
  Remarks: string;
  QueueTimeOutURL: string;
  ResultURL: string;
}
