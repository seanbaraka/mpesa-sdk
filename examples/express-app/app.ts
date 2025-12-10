import express, { Express } from "express";
import cors from "cors";
import { getMpesaService } from "./services/mpesa.service";
import { errorHandler } from "./middleware/errorHandler";
import mpesaRoutes from "./routes/mpesa.routes";
import callbackRoutes from "./routes/callbacks.routes";
import { ClientConfig } from "@tashie/mpesa-sdk";

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (optional)
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  }
);

// Initialize MPesa service
const mpesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  environment: (process.env.MPESA_ENVIRONMENT || "sandbox") as
    | "sandbox"
    | "production",
  shortCode: process.env.MPESA_SHORTCODE!,
  passKey: process.env.MPESA_PASSKEY!,
};

// Validate required environment variables
const requiredEnvVars = [
  "MPESA_CONSUMER_KEY",
  "MPESA_CONSUMER_SECRET",
  "MPESA_SHORTCODE",
  "MPESA_PASSKEY",
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

// Initialize MPesa service
getMpesaService(mpesaConfig as ClientConfig);

// Health check endpoint
app.get("/health", (req: express.Request, res: express.Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "mpesa-express-api",
  });
});

// API Routes
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/mpesa/callbacks", callbackRoutes);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
