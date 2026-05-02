// import mongoose from "mongoose";  // not required
import { userSchema, User } from "./user.schema.js";
import { errorLogger } from "../../middlewares/user/logger.middleware.js";
import ApplicationError from "../../error_handler/app.error.js";
import mongoose from "mongoose";

//define model
// const User = mongoose.model("User", userSchema); // not required

class UserRepository {
  async signUp(user) {
    try {
      // console.log("newUser from UserRepository : ", newUser);
      // //1 get E-Commerce db
      // const db = getDataBase();          //////step 1 and 2 is not required here
      // //2. get collection

      // const collection = db.collection("users");
      //3 insert new user to User collection in E-Commerce db

      const newUser = new User(user); // this will create a user but not insert in db

      console.log("newUser from repository", newUser); // here User means collection name; no need to write collection.(user)
      await newUser.save(); //db call. this will save the user in db
      //users.push(newUser);
      return newUser;
    } catch (e) {
      const errorMessage = `Error in UserRepository signUp: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      if (e instanceof mongoose.Error.ValidationError) {
        throw e;
      } else {
        throw new ApplicationError(500, "something went wrong");
      }
    }
  }

  // login() {

  // }

  async updatePassword(newPassword, userId) {
    console.log("userId from repository : ", userId);
    const user = await User.findById(userId); //update user Object
    console.log("from repository", newPassword, typeof newPassword);
    user.password = newPassword;
    await user.save(); // save updated user
  }

  async getByEmail(email) {
    try {
      // const db = getDataBase();
      // const collection = db.collection("users");
      return await User.findOne({ email }); // this line is same as below
      // return await User.findOne({ email });
    } catch (e) {
      const errorMessage = `Error in UserRepository mail: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
}

export default UserRepository;
