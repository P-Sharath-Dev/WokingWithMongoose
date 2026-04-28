import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import { errorLogger } from "../../middlewares/user/logger.middleware.js";
import UserRepository from "../user/user.repository.js";
import ApplicationError from "../../error_handler/app.error.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
    this.userRepository = new UserRepository();
  }
  //********add product function***********
  async addProduct(req, res) {
    try {
      console.log(req.body);

      const { name, description, category, price, stock } = req.body;
      const userId = req.userId;
      const priceInNumber = Number(price);
      const stockInNumber = Number(stock);
      console.log(typeof price);
      const imageUrl = req.file ? `/imageFiles/${req.file.filename}` : null;

      const product = new ProductModel(
        name,
        description,
        imageUrl,
        category,
        priceInNumber,
        stockInNumber,
      );
      const userFound = await this.userRepository.getUserById(userId);
      if (userFound.type !== "seller") {
        return res.status(401).send("user must be seller");
      }
      const addedProduct = await this.productRepository.addProduct(product);
      return res
        .status(201)
        .send({ message: "product added", productId: addedProduct.insertedId });
    } catch (e) {
      const errorMessage = `Error in productController all products: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //********get all products function***********
  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAllProducts();
      return res.status(200).json(products);
    } catch (e) {
      const errorMessage = `Error in productController all products: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //********get a product function***********
  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await this.productRepository.getProductById(productId);

      if (!product) {
        return res.status(404).send("Product not found");
      }
      return res.status(200).json(product);
    } catch (e) {
      const errorMessage = `Error in productController product by id: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //********filtering products function***********
  async getFilteredProducts(req, res) {
    try {
      //console.log("req.query", req.query);
      const { minPrice, maxPrice, category } = req.query;

      // const filteredProducts = await this.productRepository.getFilteredProducts(
      //   minPrice,
      //   maxPrice,
      //   category
      // );

      //Ensure at least one field is provided
      // if (!minPrice && !maxPrice && !category) {
      //   return res
      //     .status(400)
      //     .send("At least one field must be provided to filter");
      // }
      // Convert prices to numbers if they are provided
      const minPriceNum = minPrice ? Number(minPrice) : null; //we get price as string so we are converting it to a number
      const maxPriceNum = maxPrice ? Number(maxPrice) : null;

      const filteredProducts = await this.productRepository.getFilteredProducts(
        minPriceNum,
        maxPriceNum,
        category,
      );
      if (!filteredProducts) {
        return res.status(404).send("no product not found");
      }
      return res.status(200).send(filteredProducts);
    } catch (e) {
      const errorMessage = `Error in productController filtered products: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //******** rate produt function***********
  async rateProduct(req, res) {
    try {
      //destructuring
      const { rating, productId } = req.body;
      //console.log("product id from controller : ", productId);
      const userId = req.userId;
      //console.log("userID from controller : ", userId);
      const ratingNum = Number(rating);
      //  rating  between 1 and 5
      if (ratingNum < 1 || ratingNum > 5) {
        return res.status(400).send("Rating must be 1 to 5 only");
      }
      if (!rating || !productId) {
        return res
          .status(400)
          .send("please fill 'rating' and 'productId' fields");
      }

      const addRating = await this.productRepository.rateProduct(
        userId,
        productId,
        ratingNum,
        //productFound
      );
      return res.status(200).send("added Rating successfully");
    } catch (e) {
      const errorMessage = `Error in productController filtered products: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log("error from catch-controller : ", e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //*******update product function************
  async updateProduct(req, res) {
    //console.log(req.body);
    const productId = req.params.id;
    const userId = req.userId;
    //check if no fields are provided to update

    // console.log("product id from controller : ", productId);
    //getting the product with id

    const userFound = await this.userRepository.getUserById(userId);
    if (userFound.type !== "seller") {
      return res.status(401).send("user must be seller");
    }

    const productToUpdate =
      await this.productRepository.getProductById(productId);
    // console.log("productToUpdate from controller : ", productToUpdate);
    if (!productToUpdate) {
      return res.status(404).send("Product not found");
    }
    if (
      !req.body.name &&
      !req.body.description &&
      !req.file &&
      !req.body.category &&
      !req.body.price &&
      !req.body.stock
    ) {
      return res.status(400).send("enter data to update");
    }
    const updatedData = {
      name: req.body.name || productToUpdate.name,
      description: req.body.description || productToUpdate.name,
      imageUrl: req.file
        ? `/imageFiles/${req.file.filename}`
        : productToUpdate.imageUrl,
      category: req.body.category || productToUpdate.category,
      price: req.body.price || productToUpdate.price,
      stock: req.body.stock || productToUpdate.stock,
    };

    const updatedProduct = await this.productRepository.updateProduct(
      productId,
      updatedData,
    );
    if (updatedProduct) {
      return res.status(200).json(updatedProduct);
    } else {
      return res.status(404).send("Product not found");
    }
  }

  //********delete product function***********
  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const userId = req.userId;

      //check if user is seller or not
      const userFound = await this.userRepository.getUserById(userId);
      if (userFound.type !== "seller") {
        return res.status(401).send("user must be seller");
      }

      const isDeleted = await this.productRepository.deleteProduct(productId);

      if (isDeleted) {
        //const products = await this.productRepository.getAllProducts();
        return res.status(200).json("product deleted successfully");
      } else {
        return res.status(404).send("Product not found");
      }
    } catch (e) {
      const errorMessage = `Error in product controller delete: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //aggregation average price
  async avgPrice(req, res) {
    try {
      const result =
        await this.productRepository.averageProductPricePerCategory(); //doesnt require any parameters
      return res.status(200).send(result);
    } catch (e) {
      const errorMessage = `Error in productController product by id: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //aggregation on average rating of a product
  async avgRating(req, res) {
    try {
      const result = await this.productRepository.averageProductRating(); //doesnt require any parameters
      return res.status(200).send(result);
    } catch (e) {
      const errorMessage = `Error in productController product by id: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //aggregation on total no.of ratings of a product
  async ratingCount(req, res) {
    try {
      const result = await this.productRepository.ratingCount(); //doesnt require any parameters
      return res.status(200).send(result);
    } catch (e) {
      const errorMessage = `Error in productController product by id: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
}
