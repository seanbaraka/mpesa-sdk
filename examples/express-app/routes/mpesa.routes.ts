import { Router, Request, Response } from "express";
import { getMpesaService } from "../services/mpesa.service";
import { asyncHandler } from "../middleware/errorHandler";
import { validateSTKPush, validateB2C } from "../middleware/validation";
import path from "path";
import fs from "fs";
import crypto from "crypto";

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
    const { partyA, remarks, initiator, securityCredential } = req.body;
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    if (!partyA || !remarks || !initiator || !securityCredential) {
      return res.status(400).json({
        success: false,
        error: {
          message:
            "Missing required fields: partyA, remarks, initiator, securityCredential",
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
          message:
            "Missing required fields: shortCode, confirmationUrl, validationUrl",
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

function encryptSecurityCredential(password: string): string {
  // Read the public key from certs directory
  const certPath = path.resolve(
    process.cwd(),
    "certs",
    "ProductionCertificate.cer"
  );
  const publicKey = fs.readFileSync(certPath, "utf8");
  const buffer = Buffer.from(password, "utf8");
  // Encrypt using RSA PKCS#1 v1.5 padding
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );
  // Return base64 encoded encrypted string
  return encrypted.toString("base64");
}

router.post(
  "/b2b",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      amount,
      paybillNumber,
      accountReference,
      remarks,
      initiatorName,
      securityCredential,
    } = req.body;
    const baseUrl = "https://b6f3f9885220.ngrok-free.app";

    const encryptedCredential = encryptSecurityCredential(securityCredential);
    console.log("Encrypted Credential:", encryptedCredential);
    const result = await getMpesaService().initiateB2BPayment({
      Initiator: initiatorName,
      SecurityCredential: encryptedCredential,
      CommandID: "BusinessPayBill",
      SenderIdentifierType: "4",
      RecieverIdentifierType: "4",
      Amount: amount,
      PartyA: process.env.MPESA_SHORTCODE || "",
      PartyB: paybillNumber,
      AccountReference: accountReference,
      Requester: process.env.MPESA_SHORTCODE || "",
      Remarks: remarks,
      QueueTimeOutURL: `${baseUrl}/api/mpesa/callbacks/b2b-timeout`,
      ResultURL: `${baseUrl}/api/mpesa/callbacks/b2b-result`,
    });

    res.json({
      success: true,
      data: result,
      message: "B2B payment initiated successfully",
    });
  })
);

router.post(
  "/transaction-status",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      transactionId,
      partyA,
      originalConversationID,
      remarks,
      initiatorName,
      securityCredential,
    } = req.body;
    const baseUrl = "https://b6f3f9885220.ngrok-free.app";

    const encryptedCredential = encryptSecurityCredential(securityCredential);
    console.log("Encrypted Credential:", encryptedCredential);

    const result = await getMpesaService().getTransactionStatus({
      OriginalConversationID: "",
      IdentifierType: "4",
      Occasion: "",
      Initiator: initiatorName,
      SecurityCredential: encryptedCredential,
      TransactionID: transactionId,
      PartyA: partyA,
      Remarks: remarks,
      QueueTimeOutURL: `${baseUrl}/api/mpesa/callbacks/transaction-status-timeout`,
      ResultURL: `${baseUrl}/api/mpesa/callbacks/transaction-status-result`,
    });

    res.json({
      success: true,
      data: result,
      message: "Transaction status queried successfully",
    });
  })
);

export default router;
