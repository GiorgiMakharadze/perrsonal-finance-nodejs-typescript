"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling GET reques to /categories",
    });
});
router.post("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling POST reques to /categories",
    });
});
router.get("/:categoriesId", (req, res, next) => {
    const id = req.params.categoriesId;
    if (id === "special") {
        res.status(200).json({
            message: "You discovered special category",
            id: id,
        });
    }
    else {
        res.status(200).json({
            message: "You passed an ID",
        });
    }
});
router.patch("/:categoriesId", (req, res, next) => {
    res.status(200).json({
        message: "upated category",
    });
});
router.delete("/:categoriesId", (req, res, next) => {
    res.status(200).json({
        message: "deleted category",
    });
});
exports.default = router;
