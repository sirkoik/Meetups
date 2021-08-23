import { MongoClient } from 'mongodb';

const connectMongoDB = () => {
  return MongoClient.connect(process.env.MONGODB_URI);
};

export default connectMongoDB;
