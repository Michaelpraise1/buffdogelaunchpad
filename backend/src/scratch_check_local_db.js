const mongoose = require('mongoose');

const LOCAL_URI = "mongodb://127.0.0.1:27017/buffdoge";

async function run() {
  try {
    console.log("Connecting to Local MongoDB...");
    await mongoose.connect(LOCAL_URI);
    console.log("Connected successfully to local MongoDB!");
  } catch (err) {
    console.error("Local MongoDB connection failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
