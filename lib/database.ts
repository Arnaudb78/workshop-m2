import mongoose from "mongoose";

const globalForMongoose = globalThis as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!process.env.MONGO_DB_CONNECTION_STRING) {
  throw new Error(
    "Missing MONGO_DB_CONNECTION_STRING. Add it to your .env.local file."
  );
}

const connectionString = process.env.MONGO_DB_CONNECTION_STRING;

const cached = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongoose = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(connectionString, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
