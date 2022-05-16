"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blogSchema = new mongoose_1.default.Schema({
    author_id: { type: String, require: true },
    title: { type: String, require: true },
    created_at: { type: Date, default: new Date() },
    content: { type: String, require: true },
    likes: { type: Number, default: 0 },
    // sub_title : {type: String, default : ""}
    // dislikes: {type: Number,  default: 0}
});
exports.default = mongoose_1.default.model('Blog', blogSchema);
