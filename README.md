# @tashie/mpesa-sdk

<div align="center">

![Safaricom MPesa](https://developer.safaricom.co.ke/saf-logo.svg)

**TypeScript SDK for Safaricom's MPesa Daraja API v3.0**

[![npm version](https://img.shields.io/npm/v/@tashie/mpesa-sdk.svg)](https://www.npmjs.com/package/@tashie/mpesa-sdk)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

</div>

---

## About This SDK

This is a **community-maintained, open-source TypeScript SDK** for Safaricom's MPesa Daraja API v3.0. It's production-ready, actively maintained, and provides a clean interface for integrating MPesa payments into your Node.js applications.

For official Safaricom documentation and API reference, visit the [Safaricom Developer Portal](https://developer.safaricom.co.ke/).

---

## About

This SDK provides a clean, type-safe interface to interact with Safaricom's **MPesa Daraja API v3.0**. It's designed for Node.js applications and supports all major MPesa operations including STK Push, B2C/B2B transfers, account balance queries, QR code generation, tax remittance, standing orders, and more.

**✅ Daraja 3.0 Compatible** - Built for and tested with the latest Daraja API v3.0.

## Installation

```bash
npm install @tashie/mpesa-sdk
```

## Quick Start

```typescript
import { Mpesa, Environment } from "@tashie/mpesa-sdk";

// Initialize
const mpesa = new Mpesa({
  consumerKey: "your_consumer_key",
  consumerSecret: "your_consumer_secret",
  shortCode: "your_shortcode",
  passKey: "your_passkey",
  environment: Environment.SANDBOX,
});

// Authenticate
await mpesa.getAccessToken();

// Send payment request
const result = await mpesa.sendSTKPush({
  amount: 100,
  sender: "254712345678",
  reference: "ORDER-12345",
  callbackUrl: "https://your-domain.com/callback",
  description: "Payment for order #12345",
});
```

## What You Can Do

### 1. Request Payments (STK Push)

Send payment requests to customers' phones. They receive an MPesa prompt to complete the payment.

```typescript
const result = await mpesa.sendSTKPush({
  amount: 100,
  sender: "254712345678",
  reference: "ORDER-12345",
  callbackUrl: "https://your-domain.com/callback",
  description: "Payment for order #12345",
});
```

**Response:**

```json
{
  "MerchantRequestID": "...",
  "CheckoutRequestID": "...",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing"
}
```

### 2. Send Money to Customers (B2C)

Transfer money from your business account to a customer's phone number.

```typescript
const result = await mpesa.B2C({
  InitiatorName: "testapi",
  SecurityCredential: "your_encrypted_credential",
  CommandID: "SalaryPayment",
  Amount: "100",
  PartyA: "600782",
  PartyB: "254712345678",
  Remarks: "Salary payment",
  QueueTimeOutURL: "https://your-domain.com/b2c-timeout",
  ResultURL: "https://your-domain.com/b2c-result",
  Occassion: "January Salary",
});
```

### 3. Check Account Balance

Query your MPesa business account balance.

```typescript
const result = await mpesa.getAccountBalance({
  PartyA: 600782,
  Remarks: "Balance check",
  Initiator: "testapi",
  SecurityCredential: "your_encrypted_credential",
  QueueTimeOutURL: "https://your-domain.com/balance-timeout",
  ResultURL: "https://your-domain.com/balance-result",
});
```

### 4. Generate QR Codes

Create dynamic QR codes that customers can scan to make payments.

```typescript
const result = await mpesa.generateDynamicQRCode({
  MerchantName: "Your Business Name",
  RefNo: "ORDER-12345",
  Amount: 100,
  TrxCode: "PB",
  CPI: "your_shortcode",
  Size: "300",
});

// Returns base64 encoded QR code image
// Use result.QRCode to display the QR code
```

### 5. Check Transaction Status

Query the status of any transaction.

```typescript
const result = await mpesa.getTransactionStatus({
  Initiator: "testapi",
  SecurityCredential: "your_encrypted_credential",
  TransactionID: "NEF61H8J60",
  OriginalConversationID: "7071-4170-a0e5-8345632bad442144258",
  PartyA: "600782",
  IdentifierType: "4",
  ResultURL: "https://your-domain.com/transaction-status/result",
  QueueTimeOutURL: "https://your-domain.com/transaction-status/timeout",
  Remarks: "OK",
  Occasion: "OK",
});
```

### 6. Reverse Transactions

Reverse a completed transaction.

```typescript
const result = await mpesa.initiateReversal({
  Initiator: "testapi",
  SecurityCredential: "your_encrypted_credential",
  CommandID: "TransactionReversal",
  TransactionID: "PDU91HIVIT",
  Amount: "200",
  ReceiverParty: "603021",
  RecieverIdentifierType: "11",
  ResultURL: "https://your-domain.com/reversal/result",
  QueueTimeOutURL: "https://your-domain.com/reversal/queue",
  Remarks: "Payment reversal",
});
```

### 7. Register C2B URLs

Register URLs to receive customer-to-business payment notifications.

```typescript
const result = await mpesa.registerUrls({
  ShortCode: "600782",
  ResponseType: "Completed",
  ConfirmationURL: "https://your-domain.com/c2b/confirmation",
  ValidationURL: "https://your-domain.com/c2b/validation",
});
```

### 8. Business to Business Payments (B2B)

Initiate payments from one business to another business account.

```typescript
const result = await mpesa.initiateB2BPayment({
  Initiator: "testapi",
  SecurityCredential: "your_encrypted_credential",
  CommandID: "BusinessPayBill", // or "BusinessBuyGoods", "BusinessPayToPochi", "BusinessPayToBulk"
  SenderIdentifierType: "4",
  RecieverIdentifierType: "4",
  Amount: "100",
  PartyA: "600782",
  PartyB: "600000",
  AccountReference: "INV-12345",
  Requester: "254712345678",
  Remarks: "Payment for invoice",
  QueueTimeOutURL: "https://your-domain.com/b2b-timeout",
  ResultURL: "https://your-domain.com/b2b-result",
});
```

### 9. Remit Tax

Remit tax payments to KRA (Kenya Revenue Authority) or other tax authorities.

```typescript
const result = await mpesa.remittTax({
  Initiator: "testapi",
  SecurityCredential: "your_encrypted_credential",
  CommandID: "PayTaxToKRA",
  SenderIdentifierType: "4",
  RecieverIdentifierType: "4",
  Amount: "100",
  PartyA: "600782",
  PartyB: "572572",
  AccountReference: "TAX-12345",
  Remarks: "Tax payment",
  QueueTimeOutURL: "https://your-domain.com/tax-timeout",
  ResultURL: "https://your-domain.com/tax-result",
});
```

### 10. Create Standing Orders

Create standing orders for automated recurring revenue collection. **Note:** This is a commercial API and requires communication with Safaricom to enable the M-Pesa Ratiba product.

```typescript
const result = await mpesa.createStandingOrder({
  StandingOrderName: "Monthly Subscription",
  StartDate: "20240101",
  EndDate: "20241231",
  BusinessShortCode: "600782",
  TransactionType: "CustomerPayBillOnline",
  ReceiverPartyIdentifierType: "4",
  Amount: "100",
  PartyA: "254712345678",
  CallBackURL: "https://your-domain.com/standing-order/callback",
  AccountReference: "SUB-12345",
  TransactionDesc: "Monthly subscription payment",
  Frequency: "Monthly", // or "Weekly", "Daily", etc.
});
```

## Configuration

```typescript
const mpesa = new Mpesa({
  consumerKey: "your_consumer_key", // From Safaricom Developer Portal
  consumerSecret: "your_consumer_secret", // From Safaricom Developer Portal
  shortCode: "your_shortcode", // Your MPesa business shortcode
  passKey: "your_passkey", // From Safaricom Developer Portal
  environment: Environment.SANDBOX, // or Environment.PRODUCTION
});
```

## Authentication

Before making any API calls, authenticate:

```typescript
await mpesa.getAccessToken();
```

The token is cached internally. You only need to call this once, or refresh it if you get authentication errors.

## Type Safety

All types are exported for use in your application:

```typescript
import {
  Mpesa,
  Environment,
  ClientConfig,
  STKQuery,
  B2CTransactionConfig,
  B2BPaymentQuery,
  RemittTaxQuery,
  StandingOrderCreationQuery,
  // ... and more
} from "@tashie/mpesa-sdk";
```

## Error Handling

```typescript
try {
  const result = await mpesa.sendSTKPush({...});
  console.log("Success:", result);
} catch (error) {
  console.error("Error:", error.message);
  // Handle error appropriately
}
```

## Important Notes

### Phone Number Format

Always use international format without the leading `+`:

```typescript
// ✅ Correct
sender: "254712345678";

// ❌ Wrong
sender: "+254712345678";
sender: "0712345678";
```

### Callback URLs

- Must be publicly accessible
- Use HTTPS in production
- Handle both success and failure cases
- Implement idempotency to handle duplicate callbacks

### Environment Variables

Never hardcode credentials:

```typescript
const mpesa = new Mpesa({
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  shortCode: process.env.MPESA_SHORTCODE!,
  passKey: process.env.MPESA_PASSKEY!,
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.PRODUCTION
      : Environment.SANDBOX,
});
```

## Requirements

- Node.js 18.0.0 or higher
- MPesa Daraja API v3.0 credentials from [Safaricom Developer Portal](https://developer.safaricom.co.ke/)

## Examples

See the [examples directory](./examples/) for complete working examples.

## Support & Resources

- **Issues**: [GitHub Issues](https://github.com/SeanBaraka/mpesa-sdk/issues)
- **Official MPesa API Docs**: [Safaricom Developer Portal](https://developer.safaricom.co.ke/docs)
- **Daraja API v3.0 Documentation**: [Daraja API Docs](https://developer.safaricom.co.ke/apis)

## Community & Support

This SDK is maintained by the community and is not officially affiliated with Safaricom PLC. For official Safaricom support, please contact them through their [Developer Portal](https://developer.safaricom.co.ke/).

If you encounter issues with this SDK, please open an issue on [GitHub](https://github.com/SeanBaraka/mpesa-sdk/issues).

## License

ISC

---

<div align="center">

**Built with ❤️ by [sean](https://seanbaraka.dev) for the Node.js community**

![Safaricom MPesa](https://developer.safaricom.co.ke/saf-logo.svg)

_MPesa and Safaricom are trademarks of Safaricom PLC_

</div>
