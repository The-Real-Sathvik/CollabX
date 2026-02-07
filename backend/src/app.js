import express from "express";

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "CollabX backend is running"
  });
});

export default app;
