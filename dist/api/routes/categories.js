"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const check_auth_1 = __importDefault(require("../middleware/check-auth"));
const categories_1 = require("../controllers/categories");
const router = (0, express_1.Router)();
//Making get request to /categories
router.get("/", categories_1.Categories_get_all);
//Making post request to /categories
router.post("/", check_auth_1.default, categories_1.Categories_create_category);
//Making get request to /categories/(id that user provided) and Searching by ID
router.get("/:categoriesId", categories_1.Categories_get_category);
//Making patch request to /categories/(id that user provided)
router.patch("/:categoriesId", check_auth_1.default, categories_1.Categories_change_category);
//Making delete request to /categories/(id that user provided)
router.delete("/:categoriesId", check_auth_1.default, categories_1.Categories_delete_category);
exports.default = router;
