import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = { maxPoolSize: 10 };

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var, vars-on-top
  var _mongoClientPromise: Promise<MongoClient>;
}

// 單例模式
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
