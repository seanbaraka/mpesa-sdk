import { Router, Request, Response } from "express";
import { getMpesaService } from "../services/mpesa.service";
import { asyncHandler } from "../middleware/errorHandler";
import { validateSTKPush, validateB2C } from "../middleware/validation";

const router = Router();

/**
 * STK Push - Initiate payment request
 * POST /api/mpesa/stk-push
 */
router.post(
  "/stk-push",
  validateSTKPush,
  asyncHandler(async (req: Request, res: Response) => {
    const { amount, phoneNumber, reference, description } = req.body;
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const result = await getMpesaService().sendSTKPush({
      amount,
      sender: phoneNumber,
      callbackUrl: `${baseUrl}/api/mpesa/callbacks/stk`,
      reference,
      description,
    });

    res.json({
      success: true,
      data: result,
      message: "STK Push request sent successfully",
    });
  })
);

/**
 * B2C - Send money to customer
 * POST /api/mpesa/b2c
 */
router.post(
  "/b2c",
  validateB2C,
  asyncHandler(async (req: Request, res: Response) => {
    const {
      amount,
      phoneNumber,
      remarks,
      occasion,
      initiatorName,
      securityCredential,
    } = req.body;
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const result = await getMpesaService().B2C({
      InitiatorName: initiatorName,
      SecurityCredential: securityCredential,
      CommandID: "SalaryPayment", // or "BusinessPayment", "PromotionPayment"
      Amount: amount,
      PartyA: process.env.MPESA_SHORTCODE || "",
      PartyB: phoneNumber,
      Remarks: remarks,
      QueueTimeOutURL: `${baseUrl}/api/mpesa/callbacks/b2c-timeout`,
      ResultURL: `${baseUrl}/api/mpesa/callbacks/b2c-result`,
      Occassion: occasion || "",
    });

    res.json({
      success: true,
      data: result,
      message: "B2C transaction initiated successfully",
    });
  })
);

/**
 * Account Balance Query
 * POST /api/mpesa/balance
 */
router.post(
  "/balance",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      partyA,
      remarks,
      initiator,
      securityCredential,
    } = req.body;
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    if (!partyA || !remarks || !initiator || !securityCredential) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Missing required fields: partyA, remarks, initiator, securityCredential",
        },
      });
    }

    const result = await getMpesaService().getAccountBalance({
      PartyA: parseInt(partyA),
      Remarks: remarks,
      Initiator: initiator,
      SecurityCredential: securityCredential,
      QueueTimeOutURL: `${baseUrl}/api/mpesa/callbacks/balance-timeout`,
      ResultURL: `${baseUrl}/api/mpesa/callbacks/balance-result`,
    });

    res.json({
      success: true,
      data: result,
      message: "Balance query initiated successfully",
    });
  })
);

/**
 * Register C2B URLs
 * POST /api/mpesa/register-urls
 */
router.post(
  "/register-urls",
  asyncHandler(async (req: Request, res: Response) => {
    const { shortCode, confirmationUrl, validationUrl } = req.body;
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    if (!shortCode || !confirmationUrl || !validationUrl) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Missing required fields: shortCode, confirmationUrl, validationUrl",
        },
      });
    }

    const result = await getMpesaService().registerUrls({
      ShortCode: shortCode,
      ResponseType: "Completed",
      ConfirmationURL: confirmationUrl.startsWith("http")
        ? confirmationUrl
        : `${baseUrl}${confirmationUrl}`,
      ValidationURL: validationUrl.startsWith("http")
        ? validationUrl
        : `${baseUrl}${validationUrl}`,
    });

    res.json({
      success: true,
      data: result,
      message: "URLs registered successfully",
    });
  })
);

export default router;

