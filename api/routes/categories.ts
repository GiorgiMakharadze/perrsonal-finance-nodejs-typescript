import { Request, Response, NextFunction, Router } from "express";
import mongoose from "mongoose";
import checkAuth from "../middleware/check-auth";

import Category from "../models/categories";
import Defaults from "../models/default";

const router = Router();

//Making get request to /categories
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

//Making post request to /categories
router.post(
  "/",
  checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
      });

      const result = await category.save();
      console.log(result);

      res.status(201).json({
        message: "Created category successfully",
        createdCategory: {
          name: result.name,
          _id: result._id,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  }
);

//Making get request to /categories/(id that user provided) and Searching by ID
router.get(
  "/:categoriesId",
  async (req: Request, res: Response, next: NextFunction) => {
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
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    } catch (err: Error | any) {
      if (err.name === "CastError") {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      } else {
        console.log(err);
        res.status(500).json({ error: err });
      }
    }
  }
);

//Making patch request to /categories/(id that user provided)
router.patch(
  "/:categoriesId",
  checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.categoriesId;
      const result = await Category.updateOne(
        { _id: id },
        { $set: { name: req.body.name } }
      ).exec();
      console.log(result);
      res.status(200).json({
        message: "Category updated",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  }
);

//Making delete request to /categories/(id that user provided)
router.delete(
  "/:categoriesId",
  checkAuth,
  async (req: Request, res: Response) => {
    const id = req.params.categoriesId;

    try {
      let deletedCategory = await Category.findByIdAndRemove({ _id: id })
        .select("name _id")
        .exec();

      if (!deletedCategory) {
        return res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
      await Defaults.create({ name: deletedCategory?.name });

      const { name } = deletedCategory;

      const message = `${name} is moved to defaults`;

      res.status(200).json({ message, deletedCategory });
    } catch (err: Error | any) {
      if (err.name === "CastError") {
        return res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
      console.log(err);
      res.status(500).json({ error: err });
    }
  }
);

export default router;
