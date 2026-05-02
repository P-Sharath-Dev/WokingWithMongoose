import mongoose, { modelNames, Schema } from "mongoose";
// const { Schema } = mongoose;

export const cartItemSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users" }, // String is shorthand for {type: String}
  productId: { type: Schema.Types.ObjectId, ref: "products" },
  category: String,
  quantity: Number,
});
