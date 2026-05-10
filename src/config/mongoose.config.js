import mongoose from "mongoose";
import Category from "../features/product/category.schema.js";

const url = process.env.DB_URL;

export async function connectToDBWihtMongoose() {
  try {
    await mongoose.connect(url);
    addCategories();
    console.log("connected successfully to DB using mongoose");
  } catch (error) {
    console.log("Error connecting with db", error);
  }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

async function addCategories() {
  //reason for writing this function in config file is because i want it as soon as app starts , if there are no categories then categories should add it .
  // if i write this funcion inside any other api then it will add categories only when that particular api is called.
  //check if categories exists

  //categories should be available as soon as i run the app
  const categories = await Category.find();

  //create categories if it doesnt exist
  if (!categories | (categories.length == 0)) {
    const multipleCategories = await Category.insertMany([
      { name: "Books" },
      { name: "Clothing" },
      { name: "Electronics" },
      { name: "Smartphones" },
    ]);
  }
  console.log("categories added successfully");
}
