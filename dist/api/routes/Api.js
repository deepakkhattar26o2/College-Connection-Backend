"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const User_1 = __importDefault(require("./User"));
const ForgotPassword_1 = __importDefault(require("./ForgotPassword"));
const Blog_1 = __importDefault(require("./Blog"));
router.use('/user', User_1.default);
router.use('/forgot', ForgotPassword_1.default);
router.use('/blog', Blog_1.default);
exports.default = router;
