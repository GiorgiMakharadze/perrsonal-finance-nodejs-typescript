"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const categories_1 = __importDefault(require("../models/categories"));
const defaultCategories_1 = __importDefault(require("../models/defaultCategories"));
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    const categoryQuery = categories_1.default.find().select("name _id");
    const defaultCategoryQuery = defaultCategories_1.default.find().select("name _id");
    Promise.all([categoryQuery.exec(), defaultCategoryQuery.exec()])
        .then((results) => {
        const [categories, defaults] = results;
        const response = {
            categories: categories.map((category) => ({
                name: category.name,
                _id: category._id,
            })),
            defaults: defaults.map((defaultCategory) => ({
                name: defaultCategory.name,
                _id: defaultCategory._id,
                type: "default",
            })),
        };
        res.status(200).json(response);
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
});
router.post("/", (req, res, next) => {
    const category = new categories_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name: req.body.name,
    });
    category
        .save()
        .then((result) => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully",
            createdCategory: {
                name: result.name,
                _id: result._id,
            },
        });
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
    categories_1.default.findById(id)
        .select("name _id")
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
router.patch("/:categoriesId", (req, res, next) => {
    const id = req.params.categoriesId;
    categories_1.default.updateOne({ _id: id }, { $set: { name: req.body.name } })
        .exec()
        .then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Category updated",
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
});
router.delete("/:categoriesId", (req, res, next) => {
    const id = req.params.categoriesId;
    let deletedCategory;
    categories_1.default.findByIdAndRemove({ _id: id })
        .select("name _id")
        .exec()
        .then((result) => {
        deletedCategory = result;
        return defaultCategories_1.default.create({ name: deletedCategory === null || deletedCategory === void 0 ? void 0 : deletedCategory.name });
    })
        .then(() => {
        const { name } = deletedCategory;
        const message = `${name} is moved to defaults`;
        res.status(200).json({ message, deletedCategory });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});
exports.default = router;
