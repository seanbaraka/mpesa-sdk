# MPesa Express.js Example Application (Bun)

This is a complete example of how to integrate `@tashie/mpesa-sdk` into an Express.js application using **Bun** runtime with best practices.

## Features

- ✅ **Token Management**: Automatic token caching and refresh
- ✅ **Error Handling**: Centralized error handling middleware
- ✅ **Input Validation**: Request validation middleware
- ✅ **Webhook Callbacks**: Secure callback handlers for MPesa webhooks
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Environment Configuration**: Secure credential management

## Project Structure

```
express-app/
├── services/
│   └── mpesa.service.ts      # MPesa service with token management
├── routes/
│   ├── mpesa.routes.ts       # MPesa API routes
│   └── callbacks.routes.ts   # Webhook callback handlers
├── middleware/
│   ├── errorHandler.ts       # Error handling middleware
│   └── validation.ts        # Request validation middleware
├── app.ts                    # Express app configuration
├── server.ts                 # Server entry point
├── .env.example              # Environment variables template
├── bunfig.toml               # Bun configuration
├── package.json
└── tsconfig.json             # TypeScript configuration
```

## Prerequisites

- **Bun** runtime installed ([Install Bun](https://bun.sh/docs/installation))
- MPesa Daraja API credentials

## Setup

### 1. Install Bun

If you haven't installed Bun yet:

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies

```bash
cd examples/express-app
bun install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your MPesa credentials:

```bash
cp .env.example .env
```

Edit `.env` with your MPesa Daraja API credentials:

```env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_ENVIRONMENT=sandbox
BASE_URL=http://localhost:3000
```

### 4. Get MPesa Credentials

1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create an app to get your `consumerKey` and `consumerSecret`
3. Get your `shortCode` and `passKey` from your MPesa business account

### 4. Run the Application

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

## API Endpoints

### STK Push (Lipa na M-Pesa)

Initiate a payment request:

```bash
POST /api/mpesa/stk-push
Content-Type: application/json

{
  "amount": 100,
  "phoneNumber": "254712345678",
  "reference": "ORDER-12345",
  "description": "Payment for order #12345"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "MerchantRequestID": "...",
    "CheckoutRequestID": "...",
    "ResponseCode": "0",
    "ResponseDescription": "Success"
  },
  "message": "STK Push request sent successfully"
}
```

### B2C (Send Money)

Send money to a customer:

```bash
POST /api/mpesa/b2c
Content-Type: application/json

{
  "amount": "100",
  "phoneNumber": "254712345678",
  "remarks": "Salary payment",
  "occasion": "January Salary",
  "initiatorName": "YourInitiatorName",
  "securityCredential": "your_encrypted_credential"
}
```

### Account Balance Query

Query account balance:

```bash
POST /api/mpesa/balance
Content-Type: application/json

{
  "partyA": "123456",
  "remarks": "Balance check",
  "initiator": "YourInitiatorName",
  "securityCredential": "your_encrypted_credential"
}
```

### Register C2B URLs

Register confirmation and validation URLs:

```bash
POST /api/mpesa/register-urls
Content-Type: application/json

{
  "shortCode": "123456",
  "confirmationUrl": "/api/mpesa/callbacks/c2b-confirmation",
  "validationUrl": "/api/mpesa/callbacks/c2b-validation"
}
```

## Webhook Callbacks

MPesa will send callbacks to these endpoints:

- `POST /api/mpesa/callbacks/stk` - STK Push result
- `POST /api/mpesa/callbacks/b2c-result` - B2C transaction result
- `POST /api/mpesa/callbacks/b2c-timeout` - B2C timeout
- `POST /api/mpesa/callbacks/balance-result` - Balance query result
- `POST /api/mpesa/callbacks/balance-timeout` - Balance query timeout

### Important Notes for Production

1. **HTTPS Required**: MPesa requires HTTPS for production callbacks
2. **Public URL**: Your server must be publicly accessible for callbacks
3. **Security**: Implement request validation and authentication for callbacks
4. **Idempotency**: Handle duplicate callbacks gracefully

## Best Practices Implemented

### 1. Token Management

- Automatic token caching to reduce API calls
- Token refresh before expiry
- Singleton service pattern

### 2. Error Handling

- Centralized error handling middleware
- Custom error classes
- Proper HTTP status codes

### 3. Input Validation

- Request validation middleware
- Phone number format validation
- Amount validation

### 4. Security

- Environment variables for credentials
- No hardcoded secrets
- Proper error messages (no sensitive data leakage)

### 5. Code Organization

- Separation of concerns
- Reusable middleware
- Type-safe interfaces

## Testing with cURL

### STK Push Example

```bash
curl -X POST http://localhost:3000/api/mpesa/stk-push \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "phoneNumber": "254712345678",
    "reference": "TEST-001",
    "description": "Test payment"
  }'
```

## Troubleshooting

### Token Issues

- Check your `consumerKey` and `consumerSecret`
- Ensure environment is set correctly (sandbox/production)

### Callback Issues

- Use a tool like [ngrok](https://ngrok.com/) for local testing
- Ensure your callback URLs are publicly accessible
- Check that your server is running and accessible

### Validation Errors

- Phone numbers must be in format: `254XXXXXXXXX`
- Amounts must be positive numbers
- All required fields must be provided

## Next Steps

1. **Database Integration**: Store transactions in your database
2. **Authentication**: Add authentication middleware
3. **Logging**: Implement proper logging (Winston, Pino, etc.)
4. **Rate Limiting**: Add rate limiting for API endpoints
5. **Monitoring**: Add monitoring and alerting
6. **Testing**: Write unit and integration tests

## License

ISC
