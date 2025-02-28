import mongoose from 'mongoose';
import dotenv from "dotenv"
import { createAdminUser } from '../middlewares/auth.middleware.js';
// Load environment variables
dotenv.config();


const connectDB = async () => {
  try {
   
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);


    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    createAdminUser();
    console.log("✅ Admin user created");
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1); 
  }
};

// Export the function to use it in other files
export default connectDB;


