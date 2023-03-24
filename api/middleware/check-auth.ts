import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token!, process.env.JWT_KEY!);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Auth failed! Log in to continue",
    });
  }
}
