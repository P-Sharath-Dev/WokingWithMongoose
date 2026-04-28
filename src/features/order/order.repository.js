import { ObjectId } from "mongodb";
import { getClient, getDataBase } from "../../config/mongoDB.config.js";
import ApplicationError from "../../error_handler/app.error.js";
import { errorLogger } from "../../middlewares/user/logger.middleware.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    // this.db = getDataBase();
    // this.collection = this.db.collection("order"); // for me this way is not connecting to db so not using this way. to use this way in need to add await to connectToDB() in app.js and place it below the import statement of mongoDB and i need put all other import statements below await connectToDB() so that it will connect to db before importing other files.
  }

  async placeOrder(userId) {
    //get the client
    const client = getClient();

    //starting session
    const session = client.startSession(); //kept this outside try so that it can be accessed session can be accessed in catch also

    try {
      //start transaction
      session.startTransaction();
      // 1. Getting cart items and calculating total amount
      //get db
      const db = getDataBase();
      //get collection
      const collection = db.collection("order");

      //check if user has products in cart (cart_items) of not

      const cartItems = await this.getOrderAmount(userId, session);

      const orderAmount = cartItems.reduce((acc, item) => {
        return acc + item.totalAmount;
      }, 0);
      console.log("orderAmount", orderAmount);

      // const orderAmount = await this.db.getOrderAmount(userId);
      // 2. Creating the order in the Collection

      const newOrder = new OrderModel(
        ObjectId.createFromHexString(userId),
        orderAmount,
        new Date(),
      );

      await collection.insertOne(newOrder, session);
      // 3. Reducing the stock(inventory)
      //we ran a below query on mongosh in compass to add stock property
      //db.products.updateMany({}, {$set : {"stock" : 20}})
      //iterating over cartitems and updating the stock value of products
      // console.log("Number of items to update:", cartItems.length);
      for (let cartItem of cartItems) {
        await db.collection("products").updateOne(
          { _id: cartItem.productId }, //filter
          { $inc: { stock: -cartItem.quantity } },
          { session }, //reduces the stock value we dont have decrement operator so using $inc with -ve value
        );
      }

      // 4. Empty the cart

      await db.collection("cart_items").deleteMany(
        {
          userId: ObjectId.createFromHexString(userId),
        },
        { session },
      );

      //commit the transaction
      await session.commitTransaction();
    } catch (e) {
      //something went wrong -- aborting the session
      await session.abortTransaction();
      const errorMessage = `Error in orderRepository: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    } finally {
      //ending the session
      session.endSession();
    }
  }

  async getOrderAmount(userId, session) {
    try {
      //1. get the db
      const db = getDataBase();
      //2. get the collection
      // const collection = db.collection("order");

      const cartItems = await db
        .collection("cart_items")
        .aggregate(
          [
            //stage-1 : filter cart items documents by userId
            {
              $match: { userId: ObjectId.createFromHexString(userId) },
            },

            //stage-2 : Get the products data from products collection
            {
              $lookup: {
                // joins documents from another collection
                from: "products", //we want from products collection
                localField: "productId", // productId from cart_items collection which we are working on
                foreignField: "_id", //_id from products collection
                as: "productData", //we get array
              },
            },

            //stage-3 : unwind the productdata
            {
              $unwind: "$productData", //unwind- splits array elements into seperate documents.
            },

            //stage-4 : calculate the total amount for each cart item
            {
              $addFields: {
                totalAmount: { $multiply: ["$productData.price", "$quantity"] },
              },
            },
          ],
          { session },
        )
        .toArray();
      console.log("cartItems, ", cartItems);
      return cartItems;

      //iterate over result to get total cart value
      // const totalCartValue = cartItems.reduce((acc, item) => {
      //   return acc + item.totalAmount;
      // }, 0);
      // console.log("totalCartValue", totalCartValue);
      // return totalCartValue;
    } catch (e) {
      const errorMessage = `Error in orderRepository: ${e.message}`;
      errorLogger.error(errorMessage);
      console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
}
