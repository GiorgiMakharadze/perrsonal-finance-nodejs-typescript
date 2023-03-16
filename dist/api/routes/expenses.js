"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling GET request to /expenses",
    });
});
router.post("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling POST request to /expenses",
    });
});
router.get("/:expenseId", (req, res, next) => {
    const id = req.params.expenseId;
    if (id === "special") {
        res.status(200).json({
            message: "You discovered special expense",
            id: id,
        });
    }
    else {
        res.status(200).json({
            message: "You passed an ID",
        });
    }
});
router.patch("/:expenseId", (req, res, next) => {
    res.status(200).json({
        message: "updated expense",
    });
});
router.delete("/:expenseId", (req, res, next) => {
    res.status(200).json({
        message: "deleted expense",
    });
});
exports.default = router;
