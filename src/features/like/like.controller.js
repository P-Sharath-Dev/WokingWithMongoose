import { errorLogger } from "../../middlewares/user/logger.middleware.js";
import UserRepository from "../user/user.repository.js";
import ApplicationError from "../../error_handler/app.error.js";
import LikeRepository from "./like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  //get likes
  async getLikes(req, res) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepository.getLikes(id, type);
      return res.status(200).send(likes);
    } catch (e) {
      const errorMessage = `Error in productController all products: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //********like a product/category***********
  async addLike(req, res) {
    try {
      const { id, type } = req.body;
      const userId = req.userId;
      if (!type || (type != "Category" && type != "Product")) {
        return res.status(400).send("Invalid request");
      }
      if (type == "Category") {
        await this.likeRepository.likeCategory(userId, id);
      }
      if (type == "Product") {
        await this.likeRepository.likeProduct(userId, id);
      }
      // await this.likeRepository.addLike();
      return res.status(200).send(`${type} is liked successfully`);
    } catch (e) {
      const errorMessage = `Error in productController all products: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
}
