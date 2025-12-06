import { Request, Response, NextFunction } from "express";

/**
 * Custom error class for MPesa API errors
 */
export class MpesaError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "MpesaError";
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error | MpesaError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);

  if (err instanceof MpesaError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  // Handle fetch/network errors
  if (err.message.includes("HTTP error")) {
    return res.status(500).json({
      success: false,
      error: {
        message: "MPesa API request failed",
        details: err.message,
      },
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    },
  });
}

/**
 * Async error wrapper for route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

