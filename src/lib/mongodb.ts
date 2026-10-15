import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = { maxPoolSize: 10 };

declare global {
  // allow global `var` declarations
  var _mongoClientPromise: Promise<MongoClient>;
}

// 單例模式
if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

const clientPromise = global._mongoClientPromise;

export default clientPromise;
