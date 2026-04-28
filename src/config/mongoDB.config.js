import { MongoClient } from "mongodb";
import { errorLogger } from "../middlewares/user/logger.middleware.js";
import { text } from "stream/consumers";

//connection URL
const url = process.env.DB_URL;

const client = new MongoClient(url);

//database name
//const dbName = "Movies";
let db;
let clientInstance;
//function for client to connect to db
export async function connectToDB() {
  //connect method to connect to db
  try {
    await client.connect();
    clientInstance = client;
    console.log("connected successfully to database");
    //const db = client.db(dbName);
    //const db = client.db();
    db = client.db(); //Assign the database instance

    //createIdCounter(db);  ***this line is for customId***
    //createIndex(db);
  } catch (e) {
    const errorMessage = `Error from mongoDB connection: ${e.message}`;
    errorLogger.error(errorMessage);
    console.log("Error connecting to the database:", e);
  }
  //   const collection = db.collection("highest_rated");
  //   const movies = await collection.find({}).toArray();
  //   console.log("found doucment => : ", movies);
  //   return "done.";
}

//get the client for transaction
export function getClient() {
  return clientInstance;
}

export function getDataBase() {
  if (!db) {
    throw new Error("Database is not initialized. Call connectToDB first.");
  }
  return db;
  //return client.db();
}
/*
  ***This code is for creatin counters collection for customId***

const createIdCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItem" });
  if (!existingCounter) {
    await db.collection("counters").insertOne({ _id: "cartItem", count: 0 });
  }
};
*/

//creating indexes

// const createIndex = async (db) => {
//   try {
//     await db.collection("products").createIndex({ price: 1 }); //this creats index in ascending order
//     //const indexes = db.collection("products").getIndexes();
//     // console.log("products-indexes :-  ", indexes);
//     //await db.collection("products").dropIndex("price_1"); // this drops(means deletes) the index
//     await db.collection("products").createIndex({ name: 1, category: -1 }); // this creates multiple indexes. here we are creating indexes for 'name'(assinding), 'category'(descending)
//     db.collection("products").createIndex({ description: "text" }); // this creates index wiht the name I provided
//   } catch (e) {
//     const errorMessage = `Error from mongoDB connection: ${e.message}`;
//     errorLogger.error(errorMessage);
//     console.log("Error connecting to the database:", e);
//   }
// };
