import express, { Request, Response, NextFunction } from "express";
import httpErrors from "http-errors";
import morgan from "morgan";

import categoriesRoute from "./api/routes/categories";
import expensesRoute from "./api/routes/expenses";

const app = express();

app.use(morgan("dev"));

//Routes which should handle request
app.use("/categories", categoriesRoute);
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
