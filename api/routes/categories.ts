import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";
import mongoose from "mongoose";

import Category from "../models/categories";

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
    category: req.body.category,
  });
  category
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST reques to /categories",
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
    const updateOps: { [key: string]: string } = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Category.updateOne({ _id: id }, { $set: updateOps })
      .exec()
      .then((result) => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

router.delete(
  "/:categoriesId",
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.categoriesId;
    Category.findByIdAndRemove({ _id: id })
      .exec()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        error: err;
      });
  }
);

export default router;
