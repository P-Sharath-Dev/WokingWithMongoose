import express from "express";
import ProductController from "./product.controller.js";
import fileUpload from "../../middlewares/product/fileUpload.middleware.js";

//creating instance of productController
const productController = new ProductController();

const router = express.Router();

//filtering products (req.query)
// domainName.com/api/product/filter?name=value&anotherName=value2
// router.get("/filter", productController.getFilteredProducts);
router.get("/filter", (req, res) => {
  productController.getFilteredProducts(req, res);
});

// domainName.com/api/product/
// router.get("/", productController.getAllProducts);
router.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});

//average product price per category
router.get("/averagePrice", (req, res) => {
  productController.avgPrice(req, res);
});

//average rating of product
router.get("/averageRating", (req, res) => {
  productController.avgRating(req, res);
});

//no.of ratings of product
router.get("/ratingsCount", (req, res) => {
  productController.ratingCount(req, res);
});

// domainName.com/api/product/   (req.body)
router.post("/", fileUpload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});

// domainName.com/api/product/id  (req.params)
router.get("/:id", (req, res) => {
  productController.getProductById(req, res);
});

//home work
// domainName.com/api/product/id
router.put("/:id", fileUpload.single("imageUrl"), (req, res) => {
  productController.updateProduct(req, res);
});

// domainName.com/api/product/id
// router.delete("/:id", productController.deleteProduct);
router.delete("/:id", (req, res) => {
  productController.deleteProduct(req, res);
});

// domainName.com/api/product/rate  (req.body)
// router.post("/rate", productController.rateProduct);
router.post("/rate", (req, res) => {
  productController.rateProduct(req, res);
});

export default router;
