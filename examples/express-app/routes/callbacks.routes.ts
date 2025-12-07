import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

/**
 * STK Push Callback
 * POST /api/mpesa/callbacks/stk
 * 
 * This endpoint receives the result of an STK Push transaction
 */
router.post(
  "/stk",
  asyncHandler(async (req: Request, res: Response) => {
    const callbackData = req.body;

    console.log("STK Push Callback received:", JSON.stringify(callbackData, null, 2));

    // Extract key information
    const {
      Body: {
        stkCallback: {
          ResultCode,
          ResultDesc,
          CallbackMetadata,
          MerchantRequestID,
          CheckoutRequestID,
        } = {},
      } = {},
    } = callbackData;

    if (ResultCode === 0) {
      // Transaction successful
      const metadata = CallbackMetadata?.Item || [];
      const amount = metadata.find((item: any) => item.Name === "Amount")?.Value;
      const mpesaReceiptNumber = metadata.find(
        (item: any) => item.Name === "MpesaReceiptNumber"
      )?.Value;
      const transactionDate = metadata.find(
        (item: any) => item.Name === "TransactionDate"
      )?.Value;
      const phoneNumber = metadata.find((item: any) => item.Name === "PhoneNumber")?.Value;

      console.log("Payment successful:", {
        mpesaReceiptNumber,
        amount,
        phoneNumber,
        transactionDate,
      });

      // TODO: Update your database, send notifications, etc.
      // Example:
      // await updateTransactionStatus(CheckoutRequestID, 'completed', {
      //   mpesaReceiptNumber,
      //   amount,
      //   phoneNumber,
      //   transactionDate,
      // });
    } else {
      // Transaction failed
      console.log("Payment failed:", {
        ResultCode,
        ResultDesc,
        MerchantRequestID,
        CheckoutRequestID,
      });

      // TODO: Update your database, send notifications, etc.
      // Example:
      // await updateTransactionStatus(CheckoutRequestID, 'failed', {
      //   errorCode: ResultCode,
      //   errorMessage: ResultDesc,
      // });
    }

    // Always acknowledge receipt
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Callback processed successfully",
    });
  })
);

/**
 * B2C Result Callback
 * POST /api/mpesa/callbacks/b2c-result
 */
router.post(
  "/b2c-result",
  asyncHandler(async (req: Request, res: Response) => {
    const callbackData = req.body;

    console.log("B2C Result Callback received:", JSON.stringify(callbackData, null, 2));

    const {
      Result: {
        ResultCode,
        ResultDesc,
        ResultParameters,
        OriginatorConversationID,
        ConversationID,
      } = {},
    } = callbackData;

    if (ResultCode === 0) {
      // Transaction successful
      console.log("B2C transaction successful:", {
        OriginatorConversationID,
        ConversationID,
        ResultParameters,
      });

      // TODO: Process successful B2C transaction
    } else {
      // Transaction failed
      console.log("B2C transaction failed:", {
        ResultCode,
        ResultDesc,
        OriginatorConversationID,
        ConversationID,
      });

      // TODO: Handle failed B2C transaction
    }

    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Callback processed successfully",
    });
  })
);

/**
 * B2C Timeout Callback
 * POST /api/mpesa/callbacks/b2c-timeout
 */
router.post(
  "/b2c-timeout",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("B2C Timeout Callback received:", JSON.stringify(req.body, null, 2));
    // TODO: Handle timeout scenario
    res.status(200).json({ status: "received" });
  })
);

/**
 * Balance Result Callback
 * POST /api/mpesa/callbacks/balance-result
 */
router.post(
  "/balance-result",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Balance Result Callback received:", JSON.stringify(req.body, null, 2));
    // TODO: Process balance query result
    res.status(200).json({ status: "received" });
  })
);

/**
 * Balance Timeout Callback
 * POST /api/mpesa/callbacks/balance-timeout
 */
router.post(
  "/balance-timeout",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Balance Timeout Callback received:", JSON.stringify(req.body, null, 2));
    res.status(200).json({ status: "received" });
  })
);

export default router;

