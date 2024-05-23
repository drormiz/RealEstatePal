import { expressApp } from '../server/src/config/express';
import { connectToDatabase } from '../server/src/config/db';
import dotenv from "dotenv";

export const initApp = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      dotenv.config({ path: './.envtest' })
    } else {
      dotenv.config()
    }

    await connectToDatabase();
    const app = expressApp();

    return app;
  } catch (error) {
    logger.error(error);
    throw error
  }
};