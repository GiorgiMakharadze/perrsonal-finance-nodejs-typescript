import { Router } from "express";

import checkAuth from "../middleware/check-auth";

const router = Router();
import {
  Expenses_get_all,
  Expenses_create_expense,
  Expenses_get_expense,
} from "../controllers/expenses";

//Making get request to /expenses, filtering  and sorting responses
router.get("/", checkAuth, Expenses_get_all);

//Making post request to /expenses
router.post("/", checkAuth, Expenses_create_expense);

//Making get request to /expenses/(id that user provides) and Searching by ID
router.get("/:expenseId", checkAuth, Expenses_get_expense);

export default router;
