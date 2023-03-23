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
exports.Defaults_get_default = exports.Defaults_get_all = void 0;
const default_1 = __importDefault(require("../models/default"));
const Defaults_get_all = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docs = yield default_1.default.find()
            .select("name _id description amount status type")
            .exec();
        const response = {
            defaults: docs.map((doc) => {
                return {
                    name: doc.name,
                    _id: doc._id,
                    description: doc.description,
                    amount: doc.amount,
                    status: doc.status,
                    type: "default",
                };
            }),
        };
        console.log(docs);
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
});
exports.Defaults_get_all = Defaults_get_all;
const Defaults_get_default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.defaultsId;
        const doc = yield default_1.default.findById(id)
            .select("name _id description amount status type")
            .exec();
        console.log("from database", doc);
        if (doc) {
            res.status(200).json(doc);
        }
        else {
            res.status(404).json({ message: "No valid entry found for provided ID" });
        }
    }
    catch (err) {
        if (err.name === "CastError") {
            res.status(404).json({ message: "No valid entry found for provided ID" });
        }
        else {
            console.log(err);
            res.status(500).json({ error: err });
        }
    }
});
exports.Defaults_get_default = Defaults_get_default;
