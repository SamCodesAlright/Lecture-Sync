// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const mongoUri =
//       process.env.MONGODB_URI ||
//       process.env.MONGO_URL ||
//       process.env.MONGODB_URL ||
//       process.env.DATABASE_URL;

//     if (!mongoUri) {
//       throw new Error(
//         "MongoDB connection string is missing. Set MONGODB_URI in your deployment environment variables.",
//       );
//     }

//     const conn = await mongoose.connect(mongoUri);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error connecting to MongoDB: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URL ||
      process.env.MONGODB_URL ||
      process.env.DATABASE_URL;

    console.log("MONGODB_URI exists:", !!mongoUri);

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Error Name:", error.name);
    console.error("MongoDB Error Message:", error.message);

    if (error.reason) {
      console.error("Reason:", error.reason);
    }

    process.exit(1);
  }
};

export default connectDB;
