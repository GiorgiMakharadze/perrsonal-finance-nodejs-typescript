import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Handling GET reques to /categories",
  });
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Handling POST reques to /categories",
  });
});

router.get(
  "/:categoriesId",
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.categoriesId;
    if (id === "special") {
      res.status(200).json({
        message: "You discovered special category",
        id: id,
      });
    } else {
      res.status(200).json({
        message: "You passed an ID",
      });
    }
  }
);

router.patch(
  "/:categoriesId",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: "upated category",
    });
  }
);

router.delete(
  "/:categoriesId",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: "deleted category",
    });
  }
);

export default router;
