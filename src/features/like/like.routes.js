import express from "express";
import LikeController from "./like.controller.js";

//creating instance of LikeController
const likeController = new LikeController();

const router = express.Router();

//like
router.post("/", (req, res) => {
  likeController.addLike(req, res);
});

//get likes
router.get("/", (req, res) => {
  likeController.getLikes(req, res);
});

export default router;
