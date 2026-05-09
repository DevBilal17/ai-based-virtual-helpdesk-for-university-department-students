require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const dataRoutes = require("./routes/data.routes.js");
const faqRoutes = require("./routes/faq.routes.js");
const chatRoutes = require("./routes/chat.routes.js")
const voiceRoutes = require("./routes/voice.routes.js")
const response = require("./utils/response");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple and easy CORS setup - allow all origins (you can customize this in production)
// app.use(cors());

// Production level CORS setup with allowed origins and credentials support (for cookies) - customize as needed
const allowedOrigins = ["http://localhost:5173", "https://yourdomain.com"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/chat",chatRoutes)
app.use("/api/voice",voiceRoutes)

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
