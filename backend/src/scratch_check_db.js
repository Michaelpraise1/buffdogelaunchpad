const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://michaeld56567_db_user:zIhW9mV9QrU9hpvm@cluster0-shard-00-00.zs3ycl9.mongodb.net:27017,cluster0-shard-00-01.zs3ycl9.mongodb.net:27017,cluster0-shard-00-02.zs3ycl9.mongodb.net:27017/buffdoge?ssl=true&replicaSet=atlas-fgjo7e-shard-0&authSource=admin&retryWrites=true&w=majority";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    // Get tokens count
    const Token = mongoose.model('Token', new mongoose.Schema({}, { strict: false }));
    const count = await Token.countDocuments();
    console.log(`Number of tokens: ${count}`);

    if (count > 0) {
      const tokens = await Token.find().limit(5);
      console.log("Sample tokens:", JSON.stringify(tokens, null, 2));
    }
  } catch (err) {
    console.error("Error connecting or querying:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

run();
