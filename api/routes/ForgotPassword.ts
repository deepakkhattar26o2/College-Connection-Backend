import express from "express"
import { resetPassword, sendMail, verifyOtp } from "../controllers/ForgotPassword";
const router = express.Router()

router.post('/mailer', sendMail);
router.post('/verify', verifyOtp);
router.patch('/reset', resetPassword);

export default router;