import mongoose, { modelNames } from "mongoose";
// const { Schema } = mongoose;

export const productSchema = new mongoose.Schema({
  name: String, // String is shorthand for {type: String}
  price: Number,
  category: String,
  description: String,
  imageUrl: { type: String },
  stock: Number,
  reviews: [
    // using array coz here we store multiple values(means multiple users id's who gave review)
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

export const Product = new mongoose.model("Product", productSchema);
