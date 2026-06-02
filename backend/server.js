const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
console.log("ПЕРЕВІРКА URI:", process.env.MONGODB_URI ? "ЗНАЙДЕНО ✅" : "НЕМАЄ ❌");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter);

// Connect to Database
const connectDB = require("./config/db");
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/places", require("./routes/places.routes"));
app.use("/api/plans", require("./routes/plans.routes"));
app.use("/api/history", require("./routes/history.routes"));

// Basic Route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Export app for Vercel Serverless Function compatibility
module.exports = app;
