/**
 * Instantiates a single instance mongoClient and save it on the global object.
 * @link https://www.mongo.io/docs/support/help-articles/nextjs-mongo-client-dev-practices
 */
import { env } from './env';
// import { Schema, Mongoose, model, connect, createConnection } from 'mongoose';
import { Mongoose, connect } from 'mongoose';

const mongoGlobal = global as typeof global & {
  mongoose?: Mongoose;
};

export default async function dbConnect() {
  if (mongoGlobal.mongoose) return mongoGlobal.mongoose;

  const conn = await connect(env.DATABASE_URL);

  if (env.NODE_ENV !== 'production') {
    mongoGlobal.mongoose = conn;
  }

  return conn;
}

dbConnect()
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  })
  .finally();
