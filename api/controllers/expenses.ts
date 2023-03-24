import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Expense from "../models/expenses";
import Category from "../models/categories";
import Default from "../models/default";

export const Expenses_get_all = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let query: any = {};
    const { category, type, amount, status, createdAt } = req.query;

    // Filters
    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
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
    const docs = await Expense.find(query).populate("category", "name").exec();

    if (docs.length === 0) {
      return res.status(404).json({ error: "Expenses not found" });
    }

    // Sorting by amount
    if (req.query.order === "increasing") {
      docs.sort((a, b) => +a.amount - +b.amount);
    } else if (req.query.order === "decreasing") {
      docs.sort((a, b) => +b.amount - +a.amount);
    }

    const response = {
      expenses: docs.map((doc) => {
        return {
          category: doc.category,
          type: doc.type,
          amount: doc.amount,
          status: doc.status,
          description: doc.description,
          createdAt: doc.createdAt,
          _id: doc._id,
        };
      }),
      defaults: docs.map((doc) => {
        return {
          type: doc.type,
          amount: doc.amount,
          status: doc.status,
          description: doc.description,
          createdAt: doc.createdAt,
          _id: doc._id,
        };
      }),
    };
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const Expenses_create_expense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requiredFields = ["amount", "description", "type"];
    const providedFields = Object.keys(req.body);

    if (!requiredFields.every((field) => providedFields.includes(field))) {
      return res.status(400).json({
        error: "Please provide all the required fields",
      });
    }

    const { category, description, amount, status, type } = req.body;
    if (!category) {
      const defaultExpense = new Default({
        _id: new mongoose.Types.ObjectId(),
        description,
        type,
        amount,
        status,
      });

      if (defaultExpense.type === "outgoing" && !defaultExpense.status) {
        return res.status(400).json({ error: "You forgot to add a status!" });
      }

      const result = await defaultExpense.save();
      res.status(201).json({
        message:
          "You have not selected a category, so this expense has been defaulted",
        defaultExpense: {
          _id: result._id,
          description,
          amount,
          type,
          status,
        },
      });
    } else {
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(404).json({ error: "Category not found" });
      }

      const expense = new Expense({
        category: categoryDoc._id,
        description,
        type,
        amount,
        status,
      });

      if (expense.type === "outgoing" && !expense.status) {
        return res.status(400).json({ error: "You forgot to add a status!" });
      }

      const result = await expense.save();
      res.status(201).json({
        message: "Expense created successfully",
        expense: {
          category,
          type,
          description,
          amount,
          status,
          _id: result._id,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const Expenses_get_expense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.expenseId;
    const expense = await Expense.findById(id)
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
      createdAt: expense.createdAt,
      _id: expense._id,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
