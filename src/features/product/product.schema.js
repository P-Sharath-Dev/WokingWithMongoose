import mongoose, { modelNames } from "mongoose";
// const { Schema } = mongoose;

export const productSchema = new mongoose.Schema({
  name: String, // String is shorthand for {type: String}
  price: Number,
  category: String,
  description: String,
  imageUrl: { type: String },
  stock: Number,
});
