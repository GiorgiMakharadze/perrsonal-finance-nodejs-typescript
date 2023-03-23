import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user";

export const Users_get_all = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("email _id");
    if (users.length > 0) {
      res.status(200).json({
        message: "All users",
        users: users,
      });
    } else {
      res.status(404).json({ message: "Users not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

export const Users_get_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      email: user.email,
      _id: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const Users_user_signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.find({ email: req.body.email }).exec();
    if (user.length >= 1) {
      return res.status(409).json({
        message: "Mail exists",
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
      });
      const result = await user.save();
      console.log(result);
      res.status(201).json({
        message: "User created",
        _id: user._id,
        email: user.email,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

export const Users_user_login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Request received: ", req.body);

  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    console.log("User found: ", user);

    if (!user) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    const result = await bcrypt.compare(req.body.password, user.password);
    console.log("Password compared: ", result);

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
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

export const Users_reset_password = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
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
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    const result = await user.save();
    console.log(result);
    res.status(200).json({
      message: "Password reset successful",
      newPassword: newPassword,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

export const Users_delete_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await User.findByIdAndRemove({
      _id: req.params.userId,
    }).exec();
    res.status(200).json({
      message: "User deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
