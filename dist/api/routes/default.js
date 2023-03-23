"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const default_1 = require("../controllers/default");
const router = (0, express_1.Router)();
router.get("/", default_1.Defaults_get_all);
router.get("/:defaultsId", default_1.Defaults_get_default);
exports.default = router;
