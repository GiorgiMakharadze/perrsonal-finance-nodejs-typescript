import express, { Request, Response, NextFunction } from "express";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "it works",
  });
});

export default app;
