export interface AuthResponse {
    expires_in: string;
    access_token: string;
}
export interface ClientConfig {
    consumerKey: string;
    consumerSecret: string;
    environment: string;
    shortCode: string;
    passphrase?: string;
    passKey?: string;
}
export interface UrlRegisterConfig {
    ShortCode: string;
    ResponseType: "Completed" | "Cancelled";
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