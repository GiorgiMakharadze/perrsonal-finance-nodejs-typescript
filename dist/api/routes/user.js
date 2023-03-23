"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const check_auth_1 = __importDefault(require("../middleware/check-auth"));
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
//Making get request to /user
router.get("/", user_1.Users_get_all);
//Making get request to /user/(id that user provides) and Searching by ID
router.get("/:userId", user_1.Users_get_user);
//Making post request to /user/signup  REGISTRATION
router.post("/signup", user_1.Users_user_signup);
//Making post request to /user/login AUTHENTICATION(LOG IN)
router.post("/login", user_1.Users_user_login);
//Making post request to /user/reset-password RESET PASSWORD
router.post("/reset-password", user_1.Users_reset_password);
//Making delete request to /user/(id that user provided)
router.delete("/:userId", check_auth_1.default, user_1.Users_delete_user);
exports.default = router;
