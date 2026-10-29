import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import achievementRoutes from "./routes/achievements.js";
import projectRoutes from "./routes/projects.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "ACHIEVO API" }));
app.use("/api/auth", authRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/projects", projectRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Unexpected server error." });
});

try {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/achievo");
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`ACHIEVO API running on http://localhost:${PORT}`));
} catch (error) {
  console.error("Could not connect to MongoDB. Check that MongoDB is running and MONGODB_URI is correct.");
  console.error(error.message);
  process.exit(1);
}
