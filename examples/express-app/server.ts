import app from "./app";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 MPesa API endpoints available at http://localhost:${PORT}/api/mpesa`);
  console.log(`🔔 Callback endpoints available at http://localhost:${PORT}/api/mpesa/callbacks`);
  console.log(`🌍 Environment: ${process.env.MPESA_ENVIRONMENT || "sandbox"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

