//import { urlencoded } from "express";
//import CartItemModel from "./cartItem.model.js";
import CartItemRepository from "./cartItem.repository.js";
import { errorLogger } from "../../middlewares/user/logger.middleware.js";
import ApplicationError from "../../error_handler/app.error.js";

export default class CartItemController {
  constructor() {
    this.cartItemRepository = new CartItemRepository();
  }
  async addCartItem(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.userId;
      if (!productId || !quantity) {
        return res.status(400).send("enter data to add to cart");
      }
      if (isNaN(quantity)) {
        return res.status(400).send("quantity must be a number");
      }
      //CartItemModel.addToCart(userId, productId, quantity);
      const cartItemCreated = await this.cartItemRepository.add(
        userId,
        productId,
        quantity,
      );
      //console.log("cartItemCreated : ", cartItemCreated);
      //product not found
      if (!cartItemCreated) {
        return res.status(404).send("Product not found");
      }
      return res.status(201).send("Product added to cart");
    } catch (e) {
      const errorMessage = `Error in cartController add cartItem : ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  async getAllCartItems(req, res) {
    try {
      const userId = req.userId;
      //const cartItems = CartItemModel.getCart(userId);
      const cartItems = await this.cartItemRepository.get(userId);
      if (cartItems.length === 0) {
        return res.status(404).send("No cart items found.");
      }
      return res.status(200).send(cartItems);
    } catch (e) {
      const errorMessage = `Error in cartController get all cartItems: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
  async deleteCartItem(req, res) {
    try {
      const userId = req.userId;
      const { id: cartItemId } = req.params;
      const result = await this.cartItemRepository.delete(cartItemId, userId);
      console.log("result from controller delete : ", result);
      if (result.deletedCount < 1) {
        return res.status(404).send("no items found in cart");
      }
      return res.status(200).send("product removed from cart");
    } catch (e) {
      const errorMessage = `Error in cartController delete : ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
}
