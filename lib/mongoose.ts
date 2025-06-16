import mongoose, { Mongoose } from 'mongoose';

// define the uri for mongoose connection
const MONGOOSE_URI = process.env.MONGOOSE_URI as string;
// check if there is no uri defined
if (!MONGOOSE_URI) {
  throw new Error('MONGOOSE_URI is not defined in environment variables');
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
        return cache.conn;
    }
    // If a connection promise is already in progress, wait for it to resolve
    if (!cache.promise) {
        cache.promise = mongoose.connect(MONGOOSE_URI, {
            dbName: "devflow",
        })
        .then((result) => {
            console.log('MongoDB connected successfully');
            return result;
        }).catch((error) => {
            console.error('MongoDB connection error:', error);
            throw new Error('Failed to connect to MongoDB');
        });
    }
    cache.conn = await cache.promise;
    return cache.conn;
};
export default dbConnect;
