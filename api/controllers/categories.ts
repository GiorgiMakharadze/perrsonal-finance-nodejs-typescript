import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Category from "../models/categories";
import Defaults from "../models/default";

export const Categories_get_all = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryQuery = Category.find().select("name _id");
    const defaultsQuery = Defaults.find().select(
      "name _id description amount status type"
    );

    const results = await Promise.all([
      categoryQuery.exec(),
      defaultsQuery.exec(),
    ]);

    const [categories, defaults] = results;

    const response = {
      categories: categories.map((category) => ({
        name: category.name,
        _id: category._id,
      })),
      defaults: defaults.map((defaults) => ({
        name: defaults.name,
        description: defaults.description,
        type: defaults.type,
        amount: defaults.amount,
        status: defaults.status,
        _id: defaults._id,
      })),
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const Categories_create_category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryName = await Category.findOne({ name: req.body.name });

    if (Object.keys(req.body).length !== 1 || !req.body.name) {
      return res.status(400).json({
        error: "Please provide only the category name",
      });
    } else if (categoryName) {
      return res.status(400).json({
        error: "Category with the same name already exists",
      });
    }

    const category = new Category({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
    });

    const result = await category.save();

    res.status(201).json({
      message: "Created category successfully",
      createdCategory: {
        name: result.name,
        _id: result._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const Categories_get_category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.categoriesId;

    const [categoryDoc, defaultDoc] = await Promise.all([
      Category.findById(id).select("name _id").exec(),
      Defaults.findById(id)
        .select("name _id description amount status type")
        .exec(),
    ]);

    const doc = categoryDoc || defaultDoc;

    if (doc) {
      res.status(200).json(doc);
    } else {
      res.status(404).json({ error: "No valid entry found for provided ID" });
    }
  } catch (error: Error | any) {
    if (error.name === "CastError") {
      res.status(404).json({ error: "No valid entry found for provided ID" });
    } else {
      res.status(500).json({ error });
    }
  }
};

export const Categories_change_category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryName = await Category.findOne({ name: req.body.name });

    if (Object.keys(req.body).length !== 1 || !req.body.name) {
      return res.status(400).json({
        error: "Please provide only the category name",
      });
    } else if (categoryName) {
      return res.status(400).json({
        error:
          "Your  new category name can't be the same as your old category name ",
      });
    }

    const id = req.params.categoriesId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "No valid entry found for provided ID",
      });
    }
    const result = await Category.updateOne(
      { _id: id },
      { $set: { name: req.body.name } }
    ).exec();

    res.status(200).json({
      message: "Category updated",
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const Categories_delete_category = async (
  req: Request,
  res: Response
) => {
  const id = req.params.categoriesId;

  try {
    let deletedCategory = await Category.findByIdAndRemove({ _id: id })
      .select("name _id")
      .exec();

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ error: "No valid entry found for provided ID" });
    }
    await Defaults.create({ name: deletedCategory?.name });

    const { name } = deletedCategory;

    const message = `${name} is moved to defaults`;

    res.status(200).json({ message, deletedCategory });
  } catch (error: Error | any) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ error: "No valid entry found for provided ID" });
    }
    res.status(500).json({ error });
  }
};
