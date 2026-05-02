import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/user/jwt.middleware.js";

//creating instance of UserController
const userController = new UserController();

const router = express.Router();

// domainName.com/api/user/login   (req.body)
// router.post("/login", userController.login);
router.post("/login", (req, res) => {
  userController.login(req, res);
});

// domainName.com/api/user/signup   (req.body)
// router.post("/signup", userController.signup);
router.post("/signup", (req, res, next) => {
  userController.signup(req, res, next);
});

//update password
router.put("/update/password", jwtAuth, (req, res, next) => {
  userController.updatePassword(req, res, next);
});
export default router;
