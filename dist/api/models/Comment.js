"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    blog_id: { type: String, require: true },
    user_id: { type: String, require: true },
    content: { type: String, require: true },
    created_at: { type: Date, default: new Date() }
});
exports.default = mongoose_1.default.model('Comments', commentSchema);
