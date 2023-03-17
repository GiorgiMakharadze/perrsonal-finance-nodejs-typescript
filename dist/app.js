"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const categories_1 = __importDefault(require("./api/routes/categories"));
const expenses_1 = __importDefault(require("./api/routes/expenses"));
const app = (0, express_1.default)();
//Middleware for logging request details
app.use((0, morgan_1.default)("dev"));
// Middleware for parsing body & JSON requests".
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
//CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
//Routes which should handle request
app.use("/categories", categories_1.default);
app.use("/expenses", expenses_1.default);
//Error handling
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, "Not found"));
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});
exports.default = app;
