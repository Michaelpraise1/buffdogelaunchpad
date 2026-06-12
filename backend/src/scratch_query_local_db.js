const mongoose = require('mongoose');

const LOCAL_URI = "mongodb://127.0.0.1:27017/buffdoge";

async function run() {
  try {
    console.log("Connecting to Local MongoDB...");
    await mongoose.connect(LOCAL_URI);
    console.log("Connected successfully to local MongoDB!");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Local Collections:", collections.map(c => c.name));

    // Get tokens count
    const Token = mongoose.model('Token', new mongoose.Schema({}, { strict: false }));
    const count = await Token.countDocuments();
    console.log(`Number of local tokens: ${count}`);

    if (count > 0) {
      const tokens = await Token.find().limit(5);
      console.log("Local tokens:", JSON.stringify(tokens, null, 2));
    }
  } catch (err) {
    console.error("Local MongoDB query failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
