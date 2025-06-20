import mongoose, { Mongoose } from 'mongoose';
import logger from './logger';

// define the uri for mongoose connection
const MONGODB_URI = process.env.MONGODB_URI as string;
// check if there is no uri defined
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}
// cache the mongoose instance
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Global cache for mongoose connection
declare global {
  var mongooseCache: MongooseCache;
}
// Ensure global.mongooseCache is defined
let cache = global.mongooseCache

// check if the cache exits
if (!cache) {
  cache = global.mongooseCache = { conn: null, promise: null };
}

// Function to connect to MongoDB using Mongoose
const dbConnect = async (): Promise<Mongoose> => {
    if (cache.conn) {
      logger.info('Using existing mongoose connection');
        return cache.conn;
    }
    // If a connection promise is already in progress, wait for it to resolve
    if (!cache.promise) {
        cache.promise = mongoose.connect(MONGODB_URI, {
            dbName: "devflow",
        })
        .then((result) => {
            logger.info('MongoDB connected successfully');
            return result;
        }).catch((error) => {
            logger.info('MongoDB connection error:', error);
            throw new Error('Failed to connect to MongoDB');
        });
    }
    cache.conn = await cache.promise;
    return cache.conn;
};
export default dbConnect;
