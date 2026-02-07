import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "CollabX backend is running"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
