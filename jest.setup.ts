import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const DB_NAME = "test";
const MONGO_VERSION = "4.4.0";
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: DB_NAME,
    },
    binary: {
      version: MONGO_VERSION,
      downloadDir: "./mongodb-binaries",
    },
  });

  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 30000); // Increase the timeout to 30 seconds

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
