import { Request, Response, NextFunction } from "express";

import DefaultCategory from "../models/default";

export const Defaults_get_all = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
          type: doc.type,
        };
      }),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const Defaults_get_default = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.defaultsId;
    const doc = await DefaultCategory.findById(id)
      .select("name _id description amount status type")
      .exec();

    if (doc) {
      res.status(200).json(doc);
    } else {
      res.status(404).json({ message: "No valid entry found for provided ID" });
    }
  } catch (error: Error | any) {
    if (error.name === "CastError") {
      res.status(404).json({ message: "No valid entry found for provided ID" });
    } else {
      res.status(500).json({ error });
    }
  }
};
