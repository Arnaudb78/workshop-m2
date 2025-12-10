import mongoose from "mongoose";

const globalForMongoose = globalThis as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const connectionString = process.env.MONGO_DB_CONNECTION_STRING ?? process.env.MONGODB_URI;
if (!connectionString) {
    throw new Error("Missing Mongo connection string. Set MONGO_DB_CONNECTION_STRING (or MONGODB_URI) in your env.");
}
const MONGO_URI: string = connectionString;

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
        cached.promise = mongoose.connect(MONGO_URI, {
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
