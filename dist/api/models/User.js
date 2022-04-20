"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, unique: true, require: true, matches: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/ },
    userName: { type: String },
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    password: { type: String, require: true, min: 6 },
    temp: { type: String, default: 'baka' },
    class: { type: Number, require: true },
    major: { type: String, require: true },
    bio: { type: String, default: 'I Love College Connection!' },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 }
});
exports.default = mongoose_1.default.model("User", userSchema);
