"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const default_1 = __importDefault(require("../models/default"));
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    default_1.default.find()
        .select("name _id")
        .exec()
        .then((docs) => {
        const response = {
            defaults: docs.map((doc) => {
                return {
                    name: doc.name,
                    _id: doc._id,
                    type: "default",
                };
            }),
        };
        console.log(docs);
        res.status(200).json(response);
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
    default_1.default.findById(id)
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
