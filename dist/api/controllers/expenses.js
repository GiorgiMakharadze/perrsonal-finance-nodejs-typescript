"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expenses_get_expense = exports.Expenses_create_expense = exports.Expenses_get_all = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const expenses_1 = __importDefault(require("../models/expenses"));
const categories_1 = __importDefault(require("../models/categories"));
const default_1 = __importDefault(require("../models/default"));
const Expenses_get_all = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        const { category, type, amount, status, createdAt } = req.query;
        // Filters
        if (category) {
            const categoryDoc = yield categories_1.default.findOne({ name: category });
            if (!categoryDoc) {
                return res.status(404).json({ error: "Category not found" });
            }
            query.category = categoryDoc._id;
        }
        if (type) {
            query.type = type;
        }
        if (amount) {
            query.amount = amount;
        }
        if (status) {
            query.status = status;
        }
        if (createdAt) {
            query.createdAt = createdAt;
        }
        const docs = yield expenses_1.default.find(query).populate("category", "name").exec();
        if (docs.length === 0) {
            return res.status(404).json({ error: "Expenses not found" });
        }
        // Sorting by amount
        if (req.query.order === "increasing") {
            docs.sort((a, b) => +a.amount - +b.amount);
        }
        else if (req.query.order === "decreasing") {
            docs.sort((a, b) => +b.amount - +a.amount);
        }
        const response = {
            expenses: docs.map((doc) => {
                return {
                    category: doc.category,
                    type: doc.type,
                    amount: doc.amount,
                    status: doc.status,
                    createdAt: doc.createdAt,
                    _id: doc._id,
                };
            }),
        };
        res.status(200).json({ response });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});
exports.Expenses_get_all = Expenses_get_all;
const Expenses_create_expense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, description, amount, status, type } = req.body;
        if (!category) {
            const defaultExpense = new default_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                description,
                type,
                amount,
                status,
            });
            if (defaultExpense.type === "outgoing" && !defaultExpense.status) {
                return res.status(400).json({ error: "You forgot to add a status!" });
            }
            const result = yield defaultExpense.save();
            res.status(201).json({
                message: "You have not selected a category, so this expense has been defaulted",
                defaultExpense: {
                    _id: result._id,
                    description: result.description,
                    amount: result.amount,
                    type: result.type,
                    status: result.status,
                },
            });
        }
        else {
            const categoryDoc = yield categories_1.default.findOne({ name: category });
            if (!categoryDoc) {
                return res.status(404).json({ error: "Category not found" });
            }
            const expense = new expenses_1.default({
                category: categoryDoc._id,
                description,
                type,
                amount,
                date: req.body.date,
                status,
            });
            if (expense.type === "outgoing" && !expense.status) {
                return res.status(400).json({ error: "You forgot to add a status!" });
            }
            const result = yield expense.save();
            res.status(201).json({
                message: "Expense created successfully",
                expense: {
                    category: category,
                    type: result.type,
                    description: result.description,
                    amount: result.amount,
                    status: result.status,
                    _id: result._id,
                },
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});
exports.Expenses_create_expense = Expenses_create_expense;
const Expenses_get_expense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.expenseId;
        const expense = yield expenses_1.default.findById(id)
            .populate("category", "name")
            .exec();
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.status(200).json({
            category: expense.category,
            type: expense.type,
            description: expense.description,
            amount: expense.amount,
            status: expense.status,
            _id: expense._id,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});
exports.Expenses_get_expense = Expenses_get_expense;
