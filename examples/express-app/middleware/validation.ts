import { Request, Response, NextFunction } from "express";
import { MpesaError } from "./errorHandler";

/**
 * Validation middleware for STK Push requests
 */
export function validateSTKPush(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { amount, phoneNumber, reference, description } = req.body;

  const errors: string[] = [];

  // Validate amount
  if (!amount || typeof amount !== "number" || amount <= 0) {
    errors.push("Amount must be a positive number");
  }

  // Validate phone number (Kenyan format: 254XXXXXXXXX)
  if (!phoneNumber || !/^254\d{9}$/.test(phoneNumber.replace(/\s+/g, ""))) {
    errors.push(
      "Phone number must be in format 254XXXXXXXXX (e.g., 254712345678)"
    );
  }

  // Validate reference
  if (!reference || typeof reference !== "string" || reference.length < 1) {
    errors.push("Reference is required and must be a non-empty string");
  }

  // Validate description
  if (!description || typeof description !== "string" || description.length < 1) {
    errors.push("Description is required and must be a non-empty string");
  }

  if (errors.length > 0) {
    throw new MpesaError(errors.join(", "), 400, "VALIDATION_ERROR");
  }

  // Normalize phone number
  req.body.phoneNumber = phoneNumber.replace(/\s+/g, "");

  next();
}

/**
 * Validation middleware for B2C requests
 */
export function validateB2C(req: Request, res: Response, next: NextFunction) {
  const {
    amount,
    phoneNumber,
    remarks,
    occasion,
    initiatorName,
    securityCredential,
  } = req.body;

  const errors: string[] = [];

  if (!amount || typeof amount !== "string" || parseFloat(amount) <= 0) {
    errors.push("Amount must be a positive number string");
  }

  if (!phoneNumber || !/^254\d{9}$/.test(phoneNumber.replace(/\s+/g, ""))) {
    errors.push("Phone number must be in format 254XXXXXXXXX");
  }

  if (!remarks || typeof remarks !== "string") {
    errors.push("Remarks is required");
  }

  if (!initiatorName || typeof initiatorName !== "string") {
    errors.push("InitiatorName is required");
  }

  if (!securityCredential || typeof securityCredential !== "string") {
    errors.push("SecurityCredential is required");
  }

  if (errors.length > 0) {
    throw new MpesaError(errors.join(", "), 400, "VALIDATION_ERROR");
  }

  req.body.phoneNumber = phoneNumber.replace(/\s+/g, "");

  next();
}

