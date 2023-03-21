"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const router = (0, express_1.Router)();
router.post("/signup", (req, res, next) => {
    user_1.default.find({ email: req.body.email })
        .exec()
        .then((user) => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Mail exists",
            });
        }
        else {
            bcrypt_1.default.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err,
                    });
                }
                else {
                    const user = new user_1.default({
                        _id: new mongoose_1.default.Types.ObjectId(),
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
router.delete("/:userId", (req, res, next) => {
    user_1.default.findByIdAndRemove({ _id: req.params.userId })
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
exports.default = router;
