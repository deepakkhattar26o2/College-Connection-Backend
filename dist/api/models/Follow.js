"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const followSchema = new mongoose_1.default.Schema({
    follower_id: { type: String, require: true },
    user_id: { type: String, require: true }
});
exports.default = mongoose_1.default.model("Follow", followSchema);
