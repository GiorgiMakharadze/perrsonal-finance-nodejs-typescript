import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";

import DefaultCategory from "../models/defaultCategories";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  DefaultCategory.find()
    .select("name _id")
    .exec()
    .then((docs) => {
      const response = {
        defaults: docs.map((doc) => {
          return {
            name: doc.name,
            _id: doc._id,
            type: "default",
          };
        }),
      };
      console.log(docs);
      res.status(200).json(response);
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
    DefaultCategory.findById(id)
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

export default router;
