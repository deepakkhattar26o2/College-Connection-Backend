"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ForgotPassword_1 = require("../controllers/ForgotPassword");
const router = express_1.default.Router();
router.post('/mailer', ForgotPassword_1.sendMail);
router.post('/verify', ForgotPassword_1.verifyOtp);
router.patch('/reset', ForgotPassword_1.resetPassword);
exports.default = router;
