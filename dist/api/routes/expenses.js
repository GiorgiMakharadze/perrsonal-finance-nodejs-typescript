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
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const categories_1 = __importDefault(require("../models/categories"));
const expenses_1 = __importDefault(require("../models/expenses"));
const default_1 = __importDefault(require("../models/default"));
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docs = yield expenses_1.default.find().populate("category", "name").exec();
        if (docs.length === 0) {
            return res.status(404).json({ error: "Expenses not found" });
        }
        const response = {
            expenses: docs.map((doc) => {
                return {
                    category: doc.category,
                    type: doc.type,
                    description: doc.description,
                    amount: doc.amount,
                    status: doc.status,
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
}));
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
router.get("/:expenseId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
exports.default = router;
