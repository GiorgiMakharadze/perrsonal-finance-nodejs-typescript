"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const categories_1 = __importDefault(require("../models/categories"));
const default_1 = __importDefault(require("../models/default"));
const router = (0, express_1.Router)();
//Making get request to /categories
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryQuery = categories_1.default.find().select("name _id");
        const defaultsQuery = default_1.default.find().select("name _id description amount status type");
        const results = yield Promise.all([
            categoryQuery.exec(),
            defaultsQuery.exec(),
        ]);
        const [categories, defaults] = results;
        const response = {
            categories: categories.map((category) => ({
                name: category.name,
                _id: category._id,
            })),
            defaults: defaults.map((defaults) => ({
                name: defaults.name,
                description: defaults.description,
                type: defaults.type,
                amount: defaults.amount,
                status: defaults.status,
                _id: defaults._id,
            })),
        };
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
}));
//Making post request to /categories
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = new categories_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            name: req.body.name,
        });
        const result = yield category.save();
        console.log(result);
        res.status(201).json({
            message: "Created category successfully",
            createdCategory: {
                name: result.name,
                _id: result._id,
            },
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
}));
//Making get request to /categories/(id that user provided)
router.get("/:categoriesId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.categoriesId;
        const [categoryDoc, defaultDoc] = yield Promise.all([
            categories_1.default.findById(id).select("name _id").exec(),
            default_1.default.findById(id)
                .select("name _id description amount status type")
                .exec(),
        ]);
        const doc = categoryDoc || defaultDoc;
        if (doc) {
            res.status(200).json(doc);
        }
        else {
            res
                .status(404)
                .json({ message: "No valid entry found for provided ID" });
        }
    }
    catch (err) {
        if (err.name === "CastError") {
            res
                .status(404)
                .json({ message: "No valid entry found for provided ID" });
        }
        else {
            console.log(err);
            res.status(500).json({ error: err });
        }
    }
}));
//Making patch request to /categories/(id that user provided)
router.patch("/:categoriesId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.categoriesId;
        const result = yield categories_1.default.updateOne({ _id: id }, { $set: { name: req.body.name } }).exec();
        console.log(result);
        res.status(200).json({
            message: "Category updated",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
}));
//Making delete request to /categories/(id that user provided)
router.delete("/:categoriesId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.categoriesId;
    try {
        let deletedCategory = yield categories_1.default.findByIdAndRemove({ _id: id })
            .select("name _id")
            .exec();
        if (!deletedCategory) {
            return res
                .status(404)
                .json({ message: "No valid entry found for provided ID" });
        }
        yield default_1.default.create({ name: deletedCategory === null || deletedCategory === void 0 ? void 0 : deletedCategory.name });
        const { name } = deletedCategory;
        const message = `${name} is moved to defaults`;
        res.status(200).json({ message, deletedCategory });
    }
    catch (err) {
        if (err.name === "CastError") {
            return res
                .status(404)
                .json({ message: "No valid entry found for provided ID" });
        }
        console.log(err);
        res.status(500).json({ error: err });
    }
}));
exports.default = router;
