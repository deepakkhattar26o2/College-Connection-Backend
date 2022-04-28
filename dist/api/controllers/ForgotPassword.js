"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOtp = exports.sendMail = void 0;
const User_1 = __importDefault(require("../models/User"));
require("dotenv").config();
const bcr = require("bcrypt");
const nodemailer = require("nodemailer");
const random = require("randomstring");
const smtpTransport = require("nodemailer-smtp-transport");
const transporter = nodemailer.createTransport(smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.mail,
        pass: process.env.mailPass,
    },
}));
const sendMail = (req, res) => {
    const rstr = random.generate(6);
    User_1.default.findOne({ email: req.body.email })
        .exec()
        .then((doc) => {
        if (!doc) {
            return res.status(409).json({ message: "Account Doesn't Exist!" });
        }
        User_1.default.updateOne({ email: req.body.email }, { $set: { temp: rstr } })
            .exec()
            .then((conc) => {
            var mailOptions = {
                from: "collegeconnection2cu@gmail.com",
                to: req.body.email,
                subject: "College Connection Password Reset",
                text: `Enter This OTP in The RESET Password Form : ${rstr}`,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(500).json({ message: error.message });
                }
                else {
                    console.log("Email sent: " + info.response);
                    res.status(200).json({ message: "Email Sent Successfully" });
                }
            });
        })
            .catch((err) => res.status(500).json({ message: err.message }));
    })
        .catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.sendMail = sendMail;
const verifyOtp = (req, res) => {
    // console.log(req.body);
    User_1.default.findOne({ email: req.body.email })
        .exec()
        .then((doc) => {
        if (!doc) {
            return res.status(409).json({ message: "Bad Request!" });
        }
        // console.log(req.body, doc.temp)
        if (req.body.rstr != doc.temp) {
            return res.status(409).json({ message: "Wrong OTP!" });
        }
        User_1.default.updateOne({ email: req.body.email }, { $set: { temp: "tbd" } })
            .exec()
            .then((concl) => {
            res.status(200).json({ message: "proceed" });
        })
            .catch((err) => res.status(500).json({ message: err.message }));
    })
        .catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.verifyOtp = verifyOtp;
const resetPassword = (req, res) => {
    User_1.default.findOne({ email: req.body.email })
        .exec()
        .then((doc) => {
        if (!doc) {
            return res.status(409).json({ message: "Bad Request" });
        }
        if (doc.temp != "tbd") {
            return res.status(403).json({ message: "BEGONE" });
        }
        bcr.hash(req.body.newpassword, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            User_1.default.updateOne({ email: req.body.email }, { $set: { password: hash } })
                .exec()
                .then((conc) => res.status(200).json({ message: "success" }))
                .catch((err) => {
                res.status(500).json({ message: err.message });
            });
        });
    })
        .catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.resetPassword = resetPassword;
