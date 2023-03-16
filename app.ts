import express from "express";

import categoriesRoute from "./api/routes/categories";
import expensesRoute from "./api/routes/expenses";

const app = express();

app.use("/categories", categoriesRoute);
app.use("/expenses", expensesRoute);

export default app;
