"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const check_auth_1 = __importDefault(require("../middleware/check-auth"));
const router = (0, express_1.Router)();
const expenses_1 = require("../controllers/expenses");
//Making get request to /expenses, filtering  and sorting responses
router.get("/", check_auth_1.default, expenses_1.Expenses_get_all);
//Making post request to /expenses
router.post("/", check_auth_1.default, expenses_1.Expenses_create_expense);
//Making get request to /expenses/(id that user provides) and Searching by ID
router.get("/:expenseId", check_auth_1.default, expenses_1.Expenses_get_expense);
exports.default = router;
