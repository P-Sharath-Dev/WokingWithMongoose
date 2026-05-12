import { ObjectId } from "mongodb";
import { getDataBase } from "../../config/mongoDB.config.js";
import ApplicationError from "../../error_handler/app.error.js";
import { errorLogger } from "../../middlewares/user/logger.middleware.js";
import { Product, productSchema } from "./product.schema.js";
import Category from "../product/category.schema.js";
import { userSchema } from "../user/user.schema.js";
import { Review } from "./review.schema.js";

export default class ProductRepository {
  //constructor(parameters) {}

  //***add product***
  async addProduct(product) {
    try {
      console.log("product from repo : ", product);
      //get database
      // const db = getDataBase();
      //create collection
      // const collection = db.collection("products");

      // add product to db
      const newProduct = new Product(product);
      const productDocument = await newProduct.save();

      //upadate the category
      await Category.updateMany(
        { _id: { $in: product.categories } },
        { $push: { products: productDocument._id } },
      );

      //inserting product
      // const createdProduct = await collection.insertOne(product);
      //console.log("createdProduct", createdProduct);
      // return createdProduct;
      return productDocument;
    } catch (e) {
      const errorMessage = `Error in ProductRepository addProduct: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //***get all products***
  async getAllProducts() {
    try {
      //get database
      const db = getDataBase();
      //get collection
      const collection = db.collection("products");
      //inserting product into collection
      const products = await collection.find().project({ _id: 0 }).toArray();
      //console.log("products : ", products);
      return products;
    } catch (e) {
      const errorMessage = `Error in ProductRepository get all products: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //***get product by id***
  async getProductById(id) {
    try {
      // Validate if the product ID is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return false;
      }

      //get database
      const db = getDataBase();
      //get collection
      const collection = db.collection("products");

      // Check if the product exists with the given ID
      const product = await collection.findOne({
        _id: ObjectId.createFromHexString(id),
      });
      if (!product) {
        //console.log("Product not found");
        throw new ApplicationError(404, "product not found");
        // return null;
      }

      //console.log("Product found:", product);
      return product;
    } catch (e) {
      const errorMessage = `Error in ProductRepository get product by id: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //***filtering products***
  async getFilteredProducts(minPrice, maxPrice, category) {
    try {
      //get database
      const db = getDataBase();
      //get collection
      const collection = db.collection("products");
      // Dynamically construct the query
      const query = {};
      if (minPrice) {
        query.price = { $gte: minPrice };
      }

      if (maxPrice) {
        // (in DB we have price only, not min, max price.) so used spread operator so that minPrice will not be overidden by maxPrice.
        query.price = { ...query.price, $lte: maxPrice };
      }

      if (category) {
        // query.category = category;
        // If the user sends multiple categories in the query
        // (like sending two categories -- mobile,tv) ,
        // we receive them as a single string( like "mobile,string" ).
        // so, split(",") converts that string into an array ['mobile','tv'],
        // and $in returns products whose
        // category matches any value in that array.

        query.category = { $in: category.split(",") }; // earlier in db category was a string now chaged to an array so for that commenting this line

        //$in operator
        //query.category = { $in: JSON.parse(category) }; //we get category as an array but in string form. (ex:- '['mobile','tv']'). so converting it to an array using JSON.parse()

        //$or operator
      }

      //project({_id}) means it will return all data except for the id. project will not return the field which we pass in the project(). here we passed _id so it will not include _id.
      const result = await collection
        .find(query)
        .project({
          _id: 0,
          name: 1,
          category: 1,
          price: 1,
          "ratings.rating": 1,
        })
        .toArray();

      if (result.length === 0) {
        return null;
      }
      return result;
    } catch (e) {
      const errorMessage = `Error in ProductRepository - get filtered products: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //***rate product***
  // async rateProduct(userId, productId, rating, productFound) {
  //   try {
  //     //get database
  //     const db = getDataBase();
  //     //get collection
  //     const collection = db.collection("products");

  //     // const productFound = await collection.findOne({
  //     //   _id: ObjectId.createFromHexString(productId),
  //     // });
  //     if (!productFound) {
  //       throw new ApplicationError(404, "product not found");
  //     }

  //     const userRating = productFound.ratings?.find(
  //       (ratingObj) => ratingObj.userId == userId
  //     );

  //     if (userRating) {
  //       // User already rated → update rating
  //       await collection.updateOne(
  //         {
  //           _id: ObjectId.createFromHexString(productId), //productFound._id is an object but ObjectId.createFromHexString() requires
  //           "ratings.userId": ObjectId.createFromHexString(userId), // string to check and then returns a new ObjectId.
  //         },
  //         { $set: { "ratings.$.rating": rating } }
  //       );
  //     } else {
  //       // User hasn't rated → push new rating
  //       await collection.updateOne(
  //         { _id: ObjectId.createFromHexString(productId) },
  //         {
  //           $push: {
  //             ratings: { rating, userId: ObjectId.createFromHexString(userId) },
  //           },
  //         }
  //       );
  //     }
  //   } catch (e) {
  //     const errorMessage = `Error in ProductRepository - rate product: ${e.message}`;
  //     errorLogger.error(errorMessage);
  //     //console.log(e);
  //     throw new ApplicationError(500, "something went wrong");
  //   }
  // }

  //clean version of rateProduct. above one is not that easy to understand
  // async rateProduct(userId, productId, rating) {
  //   //rateProduct using mongodb. below function is using mongoose
  //   try {
  //     //get database
  //     const db = getDataBase();

  //     //get collection
  //     const collection = db.collection("products");

  //     const productFound = await collection.findOne({
  //       _id: ObjectId.createFromHexString(productId),
  //     });

  //     if (!productFound) {
  //       throw new ApplicationError(404, "product not found");
  //     }
  //     //rate product
  //     //******pull(remove) existing rating
  //     await collection.updateOne(
  //       { _id: ObjectId.createFromHexString(productId) },
  //       {
  //         //new ObjectId() is depricated so instead of that use
  //         // ObjectId.createFromHexString(userId)
  //         $pull: { ratings: { userId: ObjectId.createFromHexString(userId) } }, // removes rating if user tries to rate again and
  //       },
  //     );
  //     //******push new rating
  //     await collection.updateOne(
  //       { _id: ObjectId.createFromHexString(productId) },
  //       {
  //         $push: {
  //           // adds new rating for the product
  //           ratings: {
  //             rating: rating,
  //             userId: ObjectId.createFromHexString(userId),
  //           },
  //         },
  //       },
  //     );
  //   } catch (e) {
  //     const errorMessage = `Error in ProductRepository - rate product: ${e.message}`;
  //     errorLogger.error(errorMessage);
  //     //console.log(e);
  //     throw new ApplicationError(500, "something went wrong");
  //   }
  // }

  //rate product using mongoose
  async rateProduct(userId, productId, rating) {
    try {
      //checking for the product
      const productDocument = await Product.findById(productId); //here no need to pass id as {_id : };

      if (!productDocument) {
        throw new Error("Product not found");
      }

      //checking if rating exists or not
      const reviewDocument = await Review.findOne({ productId, userId });

      //if rating exists then upadate
      if (reviewDocument) {
        reviewDocument.rating = rating;
        await reviewDocument.save();
      } else {
        const newReview = new Review({
          productId,
          userId,
          rating,
        });
        await newReview.save();

        // adding review id to the review array in the product
        productDocument.reviews.push(newReview._id);

        await productDocument.save();
      }

      //if rating doensnt exists then insert
    } catch (e) {
      const errorMessage = `Error in ProductRepository - rate product: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //***updating product***
  async updateProduct(id, data) {
    try {
      // Validate if the product ID is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return false;
      }

      //get database
      const db = getDataBase();
      //get collection
      const collection = db.collection("products");
      const updatedProduct = await collection.updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: data },
      );
      return updatedProduct;
    } catch (e) {
      const errorMessage = `Error in ProductRepository - update product: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //***deleting products***
  async deleteProduct(id) {
    try {
      // Validate if the product ID is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return false;
      }

      //get database
      const db = getDataBase();
      //get collection
      const collection = db.collection("products");
      //inserting product into collection
      //console.log("id from repository : ", id);
      const result = await collection.deleteOne({
        _id: ObjectId.createFromHexString(id),
      });

      // Check if any document was deleted
      if (result.deletedCount > 0) {
        //console.log("Product deleted successfully");
        return true; // Product was deleted
      } else {
        //console.log("No product found to delete");
        return false; // No product matched the ID
      }
    } catch (e) {
      const errorMessage = `Error in ProductRepository - delete product: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //To find the average product price per caterogy
  async averageProductPricePerCategory() {
    //console.log("producRepository.avgPrice called");
    try {
      //get database
      const db = getDataBase();
      //get collection
      const collection = db.collection("products");

      const data = await collection
        .aggregate([
          //stage:1 -- get the average price for category
          { $group: { _id: "$category", averagePrice: { $avg: "$price" } } },
          //stage 2 -- sorting in ascending order based on averagePrice which was created on    stage-1
          { $sort: { averagePrice: 1 } },
          //stage 3 -- limiting
          { $limit: 1 },
        ])
        .toArray(); // this returns cursor so converting it to array.
      // console.log("data --- ", data);
      return data;
    } catch (e) {
      const errorMessage = `Error in ProductRepository get all products: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //Average rating of a product
  async averageProductRating() {
    //console.log("producRepository.avgPrice called");
    try {
      //get database
      const db = getDataBase();
      //get collection
      const collection = db.collection("products");

      const data = await collection
        .aggregate([
          //stage:1 -- get ratings
          { $unwind: "$ratings" },
          //stage 2 -- get average rating
          {
            $group: {
              _id: "$name",
              averageRating: { $avg: "$ratings.rating" },
            },
          },
          //stage 3 -- getting products with average rating >=4
          { $match: { averageRating: { $gte: 4 } } },
        ])
        .toArray(); // this returns cursor so converting it to array.
      // console.log("data --- ", data);
      return data;
    } catch (e) {
      const errorMessage = `Error in ProductRepository get all products: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  //find count of ratings of product
  async ratingCount() {
    //console.log("producRepository.avgPrice called");
    try {
      //get database
      const db = getDataBase();
      //get collection
      const collection = db.collection("products");

      const data = await collection
        .aggregate([
          //stage:1 -- get ratings
          {
            $project: {
              name: 1,
              ratingCount: {
                $cond: [{ $isArray: "$ratings" }, { $size: "$ratings" }, 0],
                //if    (condition)                {true}              {false}
                //we can directly use $size but there will be some documents without ratings, so using condition ($cond). its like if condition.
              },
            },
          },
          //stage-2 : find the product with highest ratingCount
          { $sort: { ratingCount: -1 } }, //this will give documents in decending order(highest to least)

          //stage-3 : getting product with more ratings
          //{ $limit: 1 }, //this will give first document after sorting
        ])
        .toArray(); // this returns cursor so converting it to array.
      // console.log("data --- ", data);
      return data;
    } catch (e) {
      const errorMessage = `Error in ProductRepository get all products: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
}
