import ApplicationError from "../../error_handler/app.error.js";
import { getDataBase } from "../../config/mongoDB.config.js";
import { errorLogger } from "../../middlewares/user/logger.middleware.js";
import { ObjectId } from "mongodb";

class UserRepository {
  async signUp(newUser) {
    try {
      console.log("newUser from UserRepository : ", newUser);
      //1 get E-Commerce db
      const db = getDataBase();
      //2. get collection
      const collection = db.collection("users");
      //3 insert new user to User collection in E-Commerce db
      const createdUser = await collection.insertOne(newUser);
      console.log("createdUser from repository", createdUser);
      //users.push(newUser);
      return createdUser;
    } catch (e) {
      const errorMessage = `Error in UserRepository signUp: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
  async getByEmail(email) {
    try {
      const db = getDataBase();
      const collection = db.collection("users");
      return await collection.findOne({ email });
    } catch (e) {
      const errorMessage = `Error in UserRepository mail: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  async getUserById(userId) {
    try {
      const db = getDataBase();
      const collection = db.collection("users");
      const result = await collection.findOne({ _id: new ObjectId(userId) });
      if (!result) {
        return "user Not Found";
      }
      return result;
    } catch (e) {
      const errorMessage = `Error in UserRepository get user by id: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
}

export default UserRepository;
