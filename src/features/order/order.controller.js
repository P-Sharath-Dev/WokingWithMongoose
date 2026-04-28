import OrderRepository from "./order.repository.js";
import ApplicationError from "../../error_handler/app.error.js";

import { errorLogger } from "../../middlewares/user/logger.middleware.js";

export default class OrderController {
  constructor() {
    this.orderController = new OrderRepository();
  }

  //place order
  async placeOrder(req, res, next) {
    try {
      const userId = req.userId; //getting userid from jwtAuth
      await this.orderController.placeOrder(userId);
      res.status(201).send("order placed successfully");
    } catch (e) {
      const errorMessage = `Error in orderController add cartItem : ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
      next();
    }
  }
}
