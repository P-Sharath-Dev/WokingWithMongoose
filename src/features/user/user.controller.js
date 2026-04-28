import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import { errorLogger } from "../../middlewares/user/logger.middleware.js";
import bcrypt from "bcrypt";

export default class userController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  //login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      //1 check if user exists
      const user = await this.userRepository.getByEmail(email);
      if (!user) {
        return res.status(400).send("email not found");
      }

      //2 check if password matches
      const isPosswordMatch = await bcrypt.compare(password, user.password);
      if (!isPosswordMatch) {
        return res.status(400).send("incorrect password");
      }

      //create token (when user email and password are correct)
      const token = jwt.sign(
        { id: user._id.toString(), email: user.email },
        "LJ6jaSuuScTh3xPSS5xkhZJx1gmMWm05",
        { expiresIn: "1h" }
      );
      //add console to log tokem from line : 29
      return res.status(200).send({ token, msg: "logged in successfully" });
    } catch (e) {
      const errorMessage = `Error in userController login: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //sign up
  async signup(req, res, next) {
    try {
      const { name, email, password, type } = req.body;
      const hashPassword = await bcrypt.hash(password, 11);
      // console.log("Hashed password:", hashPassword);

      const user = new UserModel(name, email, hashPassword, type);
      const createdUser = await this.userRepository.signUp(user);
      // console.log("createdUsed from user.controller : ", createdUser);
      return res.status(201).send(user);
    } catch (e) {
      const errorMessage = `Error in userController signUp: ${e.message}`;
      errorLogger.error(errorMessage);
      next(e);
    }
  }

  async getUserById(req, res) {
    try {
      const userId = req.userId;
      const userFound = await this.userRepository.getById(userId);
      if (!userFound) {
        throw new ApplicationError(404, "User not found");
      }
      return userFound;
    } catch (e) {
      const errorMessage = `Error in userController getUserById: ${e.message}`;
      errorLogger.error(errorMessage);
      next(e);
    }
  }
}
