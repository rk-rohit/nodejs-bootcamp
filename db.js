const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      autoIndex: true,
    });
    console.log("Database connected successfully!");
  } catch (err) {
    console.log("Database connection failed:", err.message);
  }
};
