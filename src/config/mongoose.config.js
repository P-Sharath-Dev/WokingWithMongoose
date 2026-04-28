import mongoose from "mongoose";

const url = process.env.DB_URL;

export async function connectToDBWihtMongoose() {
  try {
    await mongoose.connect(url);
    console.log("connected successfully to DB using mongoose");
  } catch (error) {
    console.log("Error connecting with db", error);
  }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
