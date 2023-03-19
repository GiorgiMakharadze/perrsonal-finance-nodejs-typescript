"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_1 = __importDefault(require("../models/categories"));
const expenses_1 = __importDefault(require("../models/expenses"));
const default_1 = __importDefault(require("../models/default"));
const router = (0, express_1.Router)();
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
// router.post("/", (req: Request, res: Response, next: NextFunction) => {
//   const { category, description, amount, status, type } = req.body;
//   Category.findOne({ name: category })
//     .then((categoryDoc) => {
//       if (!categoryDoc) {
//         return res.status(404).json({ error: "Category not found" });
//       }
//       const expense = new Expense({
//         category: categoryDoc._id,
//         description: description,
//         type: type,
//         amount: amount,
//         status: status,
//       });
//       expense
//         .save()
//         .then((result) => {
//           res.status(201).json({
//             message: "Expense created successfully",
//             expense: {
//               category: category,
//               type: result.type,
//               description: result.description,
//               amount: result.amount,
//               status: result.status,
//               _id: result._id,
//             },
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//           if (expense.type === "outgoing" && !expense.status) {
//             res.status(400).json({ error: "You forgot to add a status!" });
//           } else {
//             res.status(500).json({ error: err });
//           }
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// });
router.post("/", (req, res, next) => {
    const { category, description, amount, status, type } = req.body;
    if (!category) {
        const defaultExpense = new default_1.default({
            description,
            amount,
            type,
            status,
        });
        defaultExpense
            .save()
            .then((result) => {
            const expense = new expenses_1.default({
                category: result._id,
                description,
                type,
                amount,
                status,
            });
            expense
                .save()
                .then((result) => {
                res.status(201).json({
                    message: "Expense created successfully",
                    expense: {
                        category: "Default Category",
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
    }
    else {
        categories_1.default.findOne({ name: category })
            .then((categoryDoc) => {
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
    }
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
//Search epenses
router.get("/search", (req, res, next) => {
    const { q } = req.query;
    expenses_1.default.find({
        $or: [
            { description: { $regex: q, $options: "i" } },
            { type: { $regex: q, $options: "i" } },
            { status: { $regex: q, $options: "i" } },
        ],
    })
        .exec()
        .then((expenses) => {
        const response = {
            expenses: expenses.map((expense) => {
                return {
                    category: expense.category,
                    type: expense.type,
                    description: expense.description,
                    amount: expense.amount,
                    status: expense.status,
                    _id: expense._id,
                };
            }),
        };
        res.status(200).json(response);
    })
        .catch((error) => {
        console.log(error);
        res.status(500).json({ error: error });
    });
});
exports.default = router;
