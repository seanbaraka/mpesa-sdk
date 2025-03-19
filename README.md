# MPESA SDK DOCUMENTATION

### Introduction

This documentation provides details on how to use the `@tashie/mpesa-sdk` package to interact with the Mpesa Api. The SDK facilitates operation such as obtaining an acess token, registering,URLs, sending STK push requests and performing B2C transactions.

### NOTE :

To obtain your M-Pesa API credentials (Consumer Key, Consumer Secret, and Shortcode), you need to register and generate them from the Daraja portal.

[Visit Site](https://developer.safaricom.co.ke/)

## INSTALLATION

To use the Mpesa SDK, install it using npm or yarn :

`npm install @tashie/mpesa-sdk`

or

`yarn add @tashie/mpesa-sdk`

## INSTALLATION AND INITIALIZING THE MPESA CLIENT

To start using the SDK, import and intialize the Mpesa Class:

```javascript
import { Mpesa } from "@tashie/mpesa-sdk";

const client = new Mpesa({
  consumerKey: "<YOUR_CONSUMER_KEY>",
  consumerSecret: "<YOUR_CONSUMER_SECRET>",
  environment: "sandbox", // Use "production" for live transactions
  shortCode: "<YOUR_SHORTCODE>",
});
```

## AUTHENTICATION

### Get Acess Token

The access token is required for API calls

```javascript
await client.getAcessToken();
```

## C2B OPERATIONS

### Register Confirmation and Validation URLs

Before processing M-PESA transactions, you must register validation and confirmation URLs

```javascript
await client.registerUrls({
  ValidationURL: "https://yourdomain.com/api/validation",
  ConfirmationURL: "https://yourdomain.com/api/confirmation",
  ShortCode: "", // Replace with your short code
  ResponseType: "Completed", // Can be "Completed" or "Cancelled"
});
```

## SENDING AN STK PUSH REQUEST

STK Push allows users to receive a pop-up request on their phone to approve payment

```javascript
await client.sendSTKPush({
  amount: 2,
  sender: "2547XXXXXXXX",
  reference: "Order123", //can be any name
  callbackUrl: "https://yourdomain.com/api/confirmation", //same as confirmation url in registerurl above
  description: "Payment for Order 123", //any name
});
```

## B2C OPERATION

### Initiating a b2c transaction

Business to Customer transaction allows businesses to send money to customers

```javascript
await client.B2C({
  InitiatorName: "api_user",
  SecurityCredential: "<ENCODED_SECURITY_CREDENTIAL>",
  Amount: 1000, //can be dynamic
  PartyA: "<YOUR_SHORTCODE>", //business till number,,,
  PartyB: "2547XXXXXXXX",
  Remarks: "Salary Payment",
  QueueTimeOutURL: "https://yourdomain.com/api/timeout",
  ResultURL: "https://yourdomain.com/api/result",
  CommandID: "BusinessPayment",
});
```

### CHECKING ACCOUNT BALANCE

The MPESA Api allows querying the account balance for a given short code

```javascript
await client.getAccountBalance({
  PartyA: "<YOUR_SHORTCODE>", // Your short code
  Remarks: "Checking balance",
  QueueTimeOutURL: "https://yourdomain.com/api/timeout",
  ResultURL: "https://yourdomain.com/api/result",
});
```

## CONCLUSION

This SDK simplifies intergration with the MPESA API. Ensure that you handle authentication properly, use appropriate URLs, and test your intergration in the sandbox environment before going live.
