import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";
import mongoose from "mongoose";

import Category from "../models/categories";
import Defaults from "../models/default";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  const categoryQuery = Category.find().select("name _id");
  const defaultsQuery = Defaults.find().select(
    "name _id description amount status _id"
  );

  Promise.all([categoryQuery.exec(), defaultsQuery.exec()])
    .then((results) => {
      const [categories, defaults] = results;
      const response = {
        categories: categories.map((category) => ({
          name: category.name,
          _id: category._id,
        })),
        defaults: defaults.map((defaults) => ({
          name: defaults.name,
          description: defaults.description,
          type: "default",
          amount: defaults.amount,
          status: defaults.status,
          _id: defaults._id,
        })),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  });
  category
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created category successfully",
        createdCategory: {
          name: result.name,
          _id: result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get(
  "/:categoriesId",
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.categoriesId;
    Category.findById(id)
      .select("name _id")
      .exec()
      .then((doc) => {
        console.log("from database", doc);
        if (doc) {
          res.status(200).json(doc);
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch((err) => {
        if (err.name === "CastError") {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        } else {
          console.log(err);
          res.status(500).json({ error: err });
        }
      });
  }
);

router.patch(
  "/:categoriesId",
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.categoriesId;
    Category.updateOne({ _id: id }, { $set: { name: req.body.name } })
      .exec()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          message: "Category updated",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
);

router.delete(
  "/:categoriesId",
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.categoriesId;
    let deletedCategory: any | undefined;
    Category.findByIdAndRemove({ _id: id })
      .select("name _id")
      .exec()
      .then((result) => {
        deletedCategory = result;
        return Defaults.create({ name: deletedCategory?.name });
      })
      .then(() => {
        const { name } = deletedCategory;
        const message = `${name} is moved to defaults`;
        res.status(200).json({ message, deletedCategory });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

export default router;
