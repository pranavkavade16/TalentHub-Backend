const mongoose = require("mongoose");

const initializeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB connection failed", error);
    throw error;
  }
};
