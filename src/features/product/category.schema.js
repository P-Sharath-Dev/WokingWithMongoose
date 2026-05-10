import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    products: [
      //contains multiple products
      {
        type: mongoose.Types.ObjectId, // contains _id's of products
        ref: "Product", //reference to product collection
      },
    ],
  },
});
const Category = mongoose.model("Category", categorySchema);
export default Category;
