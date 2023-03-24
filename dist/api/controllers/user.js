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
exports.Users_delete_user = exports.Users_reset_password = exports.Users_user_login = exports.Users_user_signup = exports.Users_get_user = exports.Users_get_all = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const Users_get_all = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find().select("email _id");
        if (users.length > 0) {
            res.status(200).json({
                message: "All users",
                users: users,
            });
        }
        else {
            res.status(404).json({ error: "Users not found" });
        }
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
});
exports.Users_get_all = Users_get_all;
const Users_get_user = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const user = yield user_1.default.findById(id).exec();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            email: user.email,
            _id: user._id,
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.Users_get_user = Users_get_user;
const Users_user_signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.find({ email: req.body.email }).exec();
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Mail exists",
            });
        }
        else if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                error: "You need to write your email and password",
            });
        }
        else if (Object.keys(req.body).length > 2) {
            return res.status(400).json({
                error: "Please write only email and password.",
            });
        }
        else {
            const hash = yield bcrypt_1.default.hash(req.body.password, 10);
            const user = new user_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                email: req.body.email,
                password: hash,
            });
            const result = yield user.save();
            res.status(201).json({
                message: "User created",
                _id: user._id,
                email: user.email,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
});
exports.Users_user_signup = Users_user_signup;
const Users_user_login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email: req.body.email }).exec();
        if (!user) {
            return res.status(401).json({
                error: "Auth failed",
            });
        }
        if (!req.body.email ||
            !req.body.password ||
            Object.keys(req.body).length > 2) {
            return res.status(400).json({
                error: "You need to write only your email and password",
            });
        }
        const result = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (result) {
            if (!process.env.JWT_KEY) {
                return res.status(500).json({
                    error: "JWT_KEY not defined",
                });
            }
            const token = jsonwebtoken_1.default.sign({
                email: user.email,
                userId: user._id,
            }, process.env.JWT_KEY, {
                expiresIn: "1hr",
            });
            return res.status(200).json({
                message: "Auth successful",
                token: token,
                _id: user._id,
            });
        }
        return res.status(401).json({
            error: "Auth failed",
        });
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
});
exports.Users_user_login = Users_user_login;
const Users_reset_password = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email: req.body.email }).exec();
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        const newPassword = req.body.password;
        if (!newPassword) {
            return res.status(500).json({
                error: "Please write your new password.",
            });
        }
        else if (Object.keys(req.body).length > 2) {
            return res.status(400).json({
                error: "Please write only email and password.",
            });
        }
        const hash = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hash;
        const result = yield user.save();
        res.status(200).json({
            message: "Password reset successful",
            newPassword: newPassword,
            _id: result._id,
        });
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
});
exports.Users_reset_password = Users_reset_password;
const Users_delete_user = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_1.default.findByIdAndRemove({
            _id: req.params.userId,
        }).exec();
        if (!result) {
            return res.status(404).json({
                error: "No valid entry found for provided ID",
            });
        }
        res.status(200).json({
            message: "User deleted",
        });
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
});
exports.Users_delete_user = Users_delete_user;
