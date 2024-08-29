import mongoose from 'mongoose';

const getDbUri = () => {
  if (process.env.NODE_ENV === 'test') {
    return process.env.MONGO_TEST_URI;
  }

  return process.env.MONGO_URI;
};

export const connectToDatabase = async () => {
  try {
    console.log(`mongo is running on ${getDbUri()}`);
    await mongoose.connect(getDbUri());
    console.log('Connected to MongoDb');
  } catch (error) {
    console.log(error);
  }
};
