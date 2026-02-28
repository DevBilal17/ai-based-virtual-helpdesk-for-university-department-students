require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");
const connectDB = require("./src/config/db.config");

const PORT = process.env.PORT || 5000;


// ================= CONNECT TO MONGODB =================

connectDB()

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 