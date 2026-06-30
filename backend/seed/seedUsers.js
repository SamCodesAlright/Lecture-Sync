import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const SALT_ROUNDS = 10;

const SEED_USERS = [
  {
    name: "Admin",
    email: "admin@gmail.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    password: "Rahul@123",
    role: "instructor",
  },
  {
    name: "Priya Patel",
    email: "priya@gmail.com",
    password: "Priya@123",
    role: "instructor",
  },
  {
    name: "John Doe",
    email: "john@gmail.com",
    password: "John@123",
    role: "instructor",
  },
  {
    name: "Neha Singh",
    email: "neha@gmail.com",
    password: "Neha@123",
    role: "instructor",
  },
  {
    name: "Alex Roy",
    email: "alex@gmail.com",
    password: "Alex@123",
    role: "instructor",
  },
];

async function seedUsers() {
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("MongoDB Connected");

  let exitCode = 0;

  try {
    console.log("Seeding Users...");

    const emails = SEED_USERS.map((u) => u.email.toLowerCase());

    const existing = await User.find({ email: { $in: emails } }).select(
      "email name",
    );
    const existingEmails = new Set(existing.map((u) => u.email));

    const usersToInsert = [];

    for (const user of SEED_USERS) {
      if (existingEmails.has(user.email)) {
        console.log(`${user.name} already exists.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
      usersToInsert.push({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      });
    }

    if (usersToInsert.length === 0) {
      console.log("No new users inserted.");
      console.log("Seeding Complete.");
      return;
    }

    const inserted = await User.insertMany(usersToInsert, { ordered: false });
    console.log(`Inserted ${inserted.length} users successfully.`);
    console.log("Seeding Complete.");
  } catch (error) {
    exitCode = 1;
    console.error("Error seeding users:", error);
  } finally {
    try {
      await mongoose.disconnect();
      console.log("MongoDB connection closed.");
    } catch (closeError) {
      console.error("Error closing MongoDB connection:", closeError);
      exitCode = 1;
    }
    process.exit(exitCode);
  }
}

seedUsers();
