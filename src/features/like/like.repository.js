import { ObjectId } from "mongodb";
import { getDataBase } from "../../config/mongoDB.config.js";
import ApplicationError from "../../error_handler/app.error.js";
import { errorLogger } from "../../middlewares/user/logger.middleware.js";
import Like from "./like.schema.js";
import Category from "../product/category.schema.js";

export default class LikeRepository {
  //get likes
  async getLikes(id, type) {
    try {
      const like = await Like.find({ likeable: id, docModel: type })
        .populate("userId", "name email") //dont use ',' inside second string
        .populate("likeable");
      return like;
    } catch (e) {
      const errorMessage = `Error in ProductRepository addProduct: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //like product
  async likeProduct(userId, productId) {
    try {
      const newLike = new Like({
        userId,
        likeable: productId,
        docModel: "Product",
      });
      await newLike.save();
    } catch (e) {
      const errorMessage = `Error in ProductRepository addProduct: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  async likeCategory(userId, categoryId) {
    try {
      const newLike = new Like({
        userId,
        likeable: categoryId,
        docModel: "Category",
      });
      await newLike.save();
    } catch (e) {
      const errorMessage = `Error in ProductRepository addProduct: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
}
