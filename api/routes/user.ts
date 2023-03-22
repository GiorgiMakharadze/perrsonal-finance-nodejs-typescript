import { Request, Response, NextFunction, Router } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import User from "../models/user";

const router = Router();

//Making post request to /user/signup  REGISTRATION
router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

//Making post request to /user/login AUTHENTICATION(LOG IN)
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  console.log("Request received: ", req.body);

  User.findOne({ email: req.body.email })
    .exec()
    .then((user: any) => {
      console.log("User found: ", user);

      if (!user) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        console.log("Password compared: ", result);

        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          if (!process.env.JWT_KEY) {
            return res.status(500).json({
              error: "JWT_KEY not defined",
            });
          }
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1hr",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        return res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//Making post request to /user/reset-password RESET PASSWORD
router.post(
  "/reset-password",
  (req: Request, res: Response, next: NextFunction) => {
    User.findOne({ email: req.body.email })
      .exec()
      .then((user: any) => {
        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        const newPassword = req.body.password;

        if (!newPassword) {
          return res.status(500).json({
            message: "Please write your new password.",
          });
        }

        bcrypt.hash(newPassword, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            user.password = hash;

            user
              .save()
              .then((result: any) => {
                console.log(result);

                res.status(200).json({
                  message: "Password reset successful",
                  newPassword: newPassword,
                });
              })
              .catch((err: Error) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
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

//Making delete request to /user/(id that user provided)
router.delete("/:userId", (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndRemove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

export default router;
