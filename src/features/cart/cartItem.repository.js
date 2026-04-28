import { ObjectId, ReturnDocument } from "mongodb";
import { getDataBase } from "../../config/mongoDB.config.js";

export default class CartItemRepository {
  async add(userId, productId, quantity) {
    try {
      //get db
      const db = getDataBase();
      //get collection
      const collection = db.collection("cart_items");
      /*
      using upsert... it can either insert or update document. here it checking if userId and poductId
       if both are present in database it will only update quantity else
       it will insert document
       without upsert we need to check if userid and productid are present and then write db query based on that
      */

      /*
      ***These lines are for customId***
        const document = await this.getNextCounterForId(db);  
        console.log("document.count from add repository : ", document.count);
      */

      //getting product with productId
      const product = await db
        .collection("products")
        .findOne({ _id: ObjectId.createFromHexString(productId) });

      //checking if product not found
      if (!product) {
        // Throwing a specific error so the controller can send a 404
        //console.log("productNotFound");
        return null;
      }

      return await collection.updateOne(
        { userId: new ObjectId(userId), productId: new ObjectId(productId) },
        {
          //$setOnInsert: { _id: document.count }, //***sets count value as id only while inserting***---***this line is for customId***
          $inc: { quantity },
        },
        { upsert: true },
      );
    } catch (e) {
      const errorMessage = `Error in cartRepository: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }

  async get(userId) {
    try {
      //get db
      const db = getDataBase();
      //get collection
      const collection = db.collection("cart_items");
      const result = await collection
        .find({ userId: new ObjectId(userId) })
        .toArray();

      // if (result.length == 0) {
      //   return "no cart items found";
      // }
      return result;
    } catch (e) {
      const errorMessage = `Error in cartRepository: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
  async delete(cartItemId, userId) {
    try {
      //get db
      const db = getDataBase();
      //get collection
      const collection = db.collection("cart_items");
      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemId),
        userId: new ObjectId(userId),
      });
      return result;
    } catch (e) {
      const errorMessage = `Error in cartRepository: ${e.message}`;
      errorLogger.error(errorMessage);
      //console.log(e);
      throw new ApplicationError(500, "something went wrong");
    }
  }
  /*
  ***This code is for incrementing count value for customId***
  async getNextCounterForId(db) {
    try {
      const document = await db.collection("counters").findOneAndUpdate(
        { _id: "cartItem" },
        { $inc: { count: 1 } },
        { returnDocument: "after" } // Ensure this resolves to a valid value
      );

      console.log("Document returned by findOneAndUpdate:", document);
      return document;
    } catch (e) {
      console.log(e);
    }
  }
  */
}
