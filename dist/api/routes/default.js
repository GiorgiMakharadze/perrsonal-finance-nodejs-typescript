"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const defaultCategories_1 = __importDefault(require("../models/defaultCategories"));
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    defaultCategories_1.default.find()
        .exec()
        .then((docs) => {
        console.log(docs);
        res.status(200).json(docs);
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
});
router.get("/:categoriesId", (req, res, next) => {
    const id = req.params.categoriesId;
    defaultCategories_1.default.findById(id)
        .exec()
        .then((doc) => {
        console.log("from database", doc);
        if (doc) {
            res.status(200).json(doc);
        }
        else {
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
        }
        else {
            console.log(err);
            res.status(500).json({ error: err });
        }
    });
});
exports.default = router;
