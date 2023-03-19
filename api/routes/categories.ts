import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";
import mongoose from "mongoose";

import Category from "../models/categories";
import DefaultCategory from "../models/defaultCategories";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  Category.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
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
        message: "Handling POST request to /categories",
        createdCategory: result,
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
        res.status(200).json(result);
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
      .exec()
      .then((result) => {
        deletedCategory = result;
        return DefaultCategory.create({ name: deletedCategory?.name });
      })
      .then(() => {
        res.status(200).json(deletedCategory);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

// router.delete(
//   "/:categoriesId",
//   (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.categoriesId;
//     Category.findByIdAndRemove({ _id: id })
//       .exec()
//       .then((result) => {
//         res.status(200).json(result);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(500).json({ error: err });
//       });
//   }
// );

export default router;
