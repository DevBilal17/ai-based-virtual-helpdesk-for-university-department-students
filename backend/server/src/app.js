require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const response = require("./utils/response");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ================= DEFAULT 404 =================
app.use((req, res, next) => {
  return response(res, 404, false, "Route not found");
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  return response(res, 500, false, "Internal Server Error");
});

module.exports = app;
