import { Request, Response, NextFunction, Router } from "express";

import DefaultCategory from "../models/default";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docs = await DefaultCategory.find()
      .select("name _id description amount status type")
      .exec();

    const response = {
      defaults: docs.map((doc) => {
        return {
          name: doc.name,
          _id: doc._id,
          description: doc.description,
          amount: doc.amount,
          status: doc.status,
          type: "default",
        };
      }),
    };

    console.log(docs);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

router.get(
  "/:defaultsId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.defaultsId;
      const doc = await DefaultCategory.findById(id)
        .select("name _id description amount status type")
        .exec();

      console.log("from database", doc);

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

export default router;
