import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/admin.routes.js";

app.use("/api/admin", adminRoutes);

dotenv.config();

connectDB(); // 

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CollabX API running");
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
