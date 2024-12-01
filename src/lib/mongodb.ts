import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable');
}

// A singleton to store the connection and promise
let cachedConnection: mongoose.Connection | null = null;
let cachedPromise: Promise<mongoose.Connection> | null = null;

async function dbConnect() {
    // If there is a cached connection, return it
    if (cachedConnection) {
        return cachedConnection;
    }

    // If there isn't a cached connection, check if there's a cached promise
    if (!cachedPromise) {
        cachedPromise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose.connection);
    }

    // Await the promise to establish the connection
    cachedConnection = await cachedPromise;
    return cachedConnection;
}

export default dbConnect;
