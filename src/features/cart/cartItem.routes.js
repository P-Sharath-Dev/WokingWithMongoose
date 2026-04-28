import express from "express";
import CartItemController from "./cartItem.controller.js";

//creating instance of cartItemController
const cartItemController = new CartItemController();

const router = express.Router();

// domainName.com/api/cart/
router.get("/", (req, res) => {
  cartItemController.getAllCartItems(req, res);
});

// domainName.com/api/cart?productId=1&quantity=1   (req.query)
router.post("/", (req, res) => {
  cartItemController.addCartItem(req, res);
});

// domainName.com/api/cart/2  (req.params)
router.delete("/:id", (req, res) => {
  cartItemController.deleteCartItem(req, res);
});

export default router;
