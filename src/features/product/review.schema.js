import mongoose from "mongoose";
// import { Schema } from "mongoose";
// export const reviewSchema = new Schema({}) //if i import {schema} then i can create schema like this. it i didnt import schema then below line is for creating schema

export const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId, // for setting type as ObjectId
    ref: "Product", //reference to products collection(conntectin to products collection)
  },
  userId: {
    type: mongoose.Types.ObjectId, // for setting type as ObjectId
    ref: "User", //reference to products collection(connecting to reviews collection)
  },
  rating: {
    type: Number,
    required: true,
  },
});

export const Review = mongoose.model("Review", reviewSchema);
