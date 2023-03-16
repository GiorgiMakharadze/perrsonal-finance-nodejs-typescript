"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categories_1 = __importDefault(require("./api/routes/categories"));
const expenses_1 = __importDefault(require("./api/routes/expenses"));
const app = (0, express_1.default)();
app.use("/categories", categories_1.default);
app.use("/expenses", expenses_1.default);
exports.default = app;
