import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";

const router = Router();

//Handle incoming GET requests to /expenses
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Handling GET request to /expenses",
  });
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Handling POST request to /expenses",
  });
});

router.get("/:expenseId", (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.expenseId;
  if (id === "special") {
    res.status(200).json({
      message: "You discovered special expense",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "You passed an ID",
    });
  }
});

router.patch(
  "/:expenseId",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: "updated expense",
    });
  }
);

router.delete(
  "/:expenseId",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: "deleted expense",
    });
  }
);

export default router;
