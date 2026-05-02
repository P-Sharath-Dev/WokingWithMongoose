import express, { json } from "express";
import "dotenv/config";
// console.log("process.env.DB_URL", process.env.DB_URL);
// console.log("process.env.SECRET_KEY", process.env.SECRET_KEY);
import porductRoutes from "./src/features/product/product.routes.js";
import userRoutes from "./src/features/user/user.routes.js";
import cartRoutes from "./src/features/cart/cartItem.routes.js";
//import basicAuth from './src/middlewares/user/basicAuth.middleware.js';
import jwtAuth from "./src/middlewares/user/jwt.middleware.js";
import swaggerUi from "swagger-ui-express";
//import swaggerDocument from './swagger.json' assert {type : "json"};
import swaggerDocument from "./swagger3.json" assert { type: "json" };
import cors from "cors";
import logger from "./src/middlewares/user/logger.middleware.js";
import ApplicationError from "./src/error_handler/app.error.js";
// import { connectToDB } from "./src/config/mongoDB.config.js";
import orderRoutes from "./src/features/order/order.routes.js";
import { connectToDBWihtMongoose } from "./src/config/mongoose.config.js";
import mongoose from "mongoose";

const app = express();
const port = 3000;

//connect to db using mongodb driver
// connectToDB();

//connect ot db using mongoose
connectToDBWihtMongoose();
//CORS library/package
const corsOptions = {
  origin: "http://127.0.0.1:5500",
  optionSuccessStatus: 200,
};
app.use(cors());

app.use(express.json());

//parsing the data
app.use(express.urlencoded({ extended: true }));

//handle CORS
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Orign', "http://127.0.0.1:5500");
//   res.header('Access-Control-Allow-Headers', "http://127.0.0.1:5500");
//   res.header('Access-Control-Allow-Methods', "http://127.0.0.1:5500");
//   if (req.method == "OPTIONS") {
//     res.sendStatus(200);
//   }
//   next();
// })

//swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//app.use('/api/product',basicAuth, porductRoutes);
app.use("/api/user", userRoutes);

//order routes
app.use("/api/order", jwtAuth, orderRoutes);

app.use(logger);

app.use("/api/product", jwtAuth, porductRoutes);

app.use("/api/cart", jwtAuth, cartRoutes);

app.get("/", (req, res) => {
  res.send("hello from rest api");
});

//send error message if user provided route does'nt match  with the available routes
app.use((req, res) => {
  res
    .status(404)
    .send("Page Not Found, check our API docs here : localhost:3000/api-docs");
});

//error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof ApplicationError) {
    const { code, message } = err;
    return res.status(code).send(message);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const { message } = err;
    // Mongoose ValidationError doesn't have an HTTP status code, so we manually send 400 (Bad Request)
    return res.status(400).send(message);
  }
  console.error(err.stack);
  return res.status(500).send("something went wrong!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
