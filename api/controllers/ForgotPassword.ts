import User from "../models/User";
import {Request, Response} from 'express';
require("dotenv").config();
const bcr = require("bcrypt");
const nodemailer = require("nodemailer");
const random = require("randomstring");
const smtpTransport = require("nodemailer-smtp-transport");
const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.mail,
      pass: process.env.mailPass,
    },
  })
);

const sendMail = (req : Request, res : Response) => {
    const rstr : string = random.generate(6);
    User.findOne({ email: req.body.email })
      .exec()
      .then((doc) => {
        if (!doc) {
          return res.status(409).json({ message: "Account Doesn't Exist!" });
        }
        User.updateOne({ email: req.body.email }, { $set: { temp: rstr } })
          .exec()
          .then((conc:any) => {
            var mailOptions = {
              from: "collegeconnection2cu@gmail.com",
              to: req.body.email,
              subject: "College Connection Password Reset",
              text: `Enter This OTP in The RESET Password Form : ${rstr}`,
            };
            transporter.sendMail(mailOptions, function (error: Error, info : any) {
              if (error) {
                res.status(500).json({ message: error.message });
              } else {
                console.log("Email sent: " + info.response);
                res.status(200).json({ message: "Email Sent Successfully" });
              }
            });
          })
          .catch((err:Error) => res.status(500).json({ message: err.message }));
      })
      .catch((err:Error) => {
        res.status(500).json({ message: err.message });
      });
  };

const verifyOtp = (req : Request, res : Response) => {
    // console.log(req.body);
    User.findOne({ email: req.body.email })
      .exec()
      .then((doc : any) => {
        if (!doc) {
          return res.status(409).json({ message: "Bad Request!" });
        }
        // console.log(req.body, doc.temp)
        if (req.body.rstr != doc.temp) {
          return res.status(409).json({ message: "Wrong OTP!" });
        }
        User.updateOne({ email: req.body.email }, { $set: { temp: "tbd" } })
          .exec()
          .then((concl : any) => {
            res.status(200).json({ message: "proceed" });
          })
          .catch((err : Error) => res.status(500).json({ message: err.message }));
      })
      .catch((err : Error) => {
        res.status(500).json({ message: err.message });
      });
  };

const resetPassword = (req : Request, res: Response) => {
    User.findOne({ email: req.body.email })
      .exec()
      .then((doc:any) => {
        if (!doc) {
          return res.status(409).json({ message: "Bad Request" });
        }
        if (doc.temp != "tbd") {
          return res.status(403).json({ message: "BEGONE" });
        }
        bcr.hash(req.body.newpassword, 10, (err : Error, hash : string) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          User.updateOne({ email: req.body.email }, { $set: { password: hash } })
            .exec()
            .then((conc : any) => res.status(200).json({ message: "success" }))
            .catch((err : Error) => {
              res.status(500).json({ message: err.message });
            });
        });
      })
      .catch((err : Error) => {
        res.status(500).json({ message: err.message });
      });
  };

export {sendMail, verifyOtp, resetPassword};