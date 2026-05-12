import mongoose from "mongoose";
// import { Schema } from "mongoose";
// export const reviewSchema = new Schema({}) //if i import {schema} then i can create schema like this. it i didnt import schema then below line is for creating schema

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // for setting type as ObjectId
    ref: "User", //reference to products collection(connecting to reviews collection)
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "docModel", // this docModel belongs to below docModel.
    // i can name anything for refPath and i should use that name below
    // example refPath : "likeReference"
    //likeReference : {type : , .....}
  },
  docModel: {
    type: String,
    enum: ["Product", "Category", "Review"],
  },
});

likeSchema.pre("save", function (next) {
  console.log("we are about to save newLike");
  //   next();
});

likeSchema.post("save", function (doc) {
  console.log(" has been initialized from the db", doc);
});

likeSchema.pre("find", function (next) {
  console.log("Retreiving likes from db ");
  //   next();
});
likeSchema.post("find", function (docs) {
  console.log("after finding the docs ", docs);
  //   next();
});
const Like = mongoose.model("Like", likeSchema);
export default Like;
