import express, { Request, Response, NextFunction } from "express";
import httpErrors from "http-errors";
import bodyParser from "body-parser";
import morgan from "morgan";

import mongoose, { ConnectOptions } from "mongoose";

import categoriesRoute from "./api/routes/categories";
import defaultCategoriesRoute from "./api/routes/default";
import expensesRoute from "./api/routes/expenses";

//Connecting to MongoDb
if (!process.env.MONGO_ATLAS) {
  throw new Error("MONGO_ATLAS environment variable is not defined");
}
mongoose
  .connect(process.env.MONGO_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

//Express
const app = express();

//Middleware for logging request details
app.use(morgan("dev"));
//Middleware for parsing body & JSON requests".
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Routes which should handle request
app.use("/categories", categoriesRoute);
app.use("/default", defaultCategoriesRoute);
app.use("/expenses", expensesRoute);

//Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  next(httpErrors(404, "Not found"));
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
