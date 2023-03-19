"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_1 = __importDefault(require("../models/categories"));
const expenses_1 = __importDefault(require("../models/expenses"));
const router = (0, express_1.Router)();
//Handle incoming GET requests to /expenses
router.get("/", (req, res, next) => {
    expenses_1.default.find()
        .populate("category", "name")
        .exec()
        .then((docs) => {
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
        res.status(200).json({
            response,
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
});
router.post("/", (req, res, next) => {
    const { category, description, amount, status, type } = req.body;
    categories_1.default.findOne({ name: category })
        .then((categoryDoc) => {
        if (!categoryDoc) {
            return res.status(404).json({ error: "Category not found" });
        }
        const expense = new expenses_1.default({
            category: categoryDoc._id,
            description: description,
            type: type,
            amount: amount,
            status: status,
        });
        expense
            .save()
            .then((result) => {
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
        })
            .catch((err) => {
            console.log(err);
            if (expense.type === "outgoing" && !expense.status) {
                res.status(400).json({ error: "You forgot to add a status!" });
            }
            else {
                res.status(500).json({ error: err });
            }
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
});
router.get("/:expenseId", (req, res, next) => {
    const id = req.params.expenseId;
    if (id === "special") {
        res.status(200).json({
            message: "You discovered special expense",
            id: id,
        });
    }
    else {
        res.status(200).json({
            message: "You passed an ID",
        });
    }
});
router.patch("/:expenseId", (req, res, next) => {
    res.status(200).json({
        message: "updated expense",
    });
});
router.delete("/:expenseId", (req, res, next) => {
    res.status(200).json({
        message: "deleted expense",
    });
});
exports.default = router;
