import express from "express";
import fileUpload from "../../middlewares/product/fileUpload.middleware.js";
import OrderController from "./order.controller.js";

//creating instance of productController
const orderController = new OrderController();

const router = express.Router();

//filtering products (req.query)
// domainName.com/api/product/filter?name=value&anotherName=value2
// router.get("/filter", productController.getFilteredProducts);

// domainName.com/api/product/
// router.get("/", orderController.placeOrder);
router.post("/", (req, res, next) => {
  orderController.placeOrder(req, res, next);
});

export default router;
