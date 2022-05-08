"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetailsById = exports.searchUserByName = exports.updateProfile = exports.login = exports.signup = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const bcr = require("bcrypt");
const jwt = require("jsonwebtoken");
const User_1 = __importDefault(require("../models/User"));
const signup = (req, res) => {
    const body = req.body;
    if (!(body.email &&
        body.class &&
        body.password &&
        body.first_name &&
        body.last_name &&
        body.major)) {
        return res.status(409).json({ message: "Bad Request!" });
    }
    console.log(body);
    User_1.default.findOne({ email: body.email })
        .exec()
        .then((doc) => {
        if (doc) {
            return res.status(409).json({ message: "Account Already Exists!" });
        }
        bcr.hash(body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            let newUser = new User_1.default({
                email: body.email,
                password: hash,
                first_name: body.first_name,
                last_name: body.last_name,
                userName: (body.first_name + " " + body.last_name).toLowerCase(),
                class: body.class,
                major: body.major,
            });
            newUser
                .save()
                .then((conc) => {
                const token = jwt.sign({
                    email: body.email,
                    first_name: body.first_name,
                    last_name: body.last_name,
                }, process.env.myKey);
                res.status(200).json({
                    message: "Signed Up Successfully",
                    token: token,
                    uid: conc._id,
                });
            })
                .catch((err) => {
                return res.status(500).json({ message: err.message });
            });
        });
    })
        .catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.signup = signup;
const login = (req, res) => {
    const body = req.body;
    if (!(body.email && body.password)) {
        return res.status(409).json({ message: "Bad Request!" });
    }
    User_1.default.findOne({ email: body.email })
        .exec()
        .then((doc) => {
        if (!doc) {
            return res.status(409).json({ message: "Account Doesn't Exist!" });
        }
        bcr.compare(body.password, doc.password, (err, same) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (!same) {
                return res.status(409).json({ message: "Invalid Password!" });
            }
            if (same) {
                const token = jwt.sign({
                    email: doc.email,
                    first_name: doc.first_name,
                    last_name: doc.last_name,
                }, process.env.myKey);
                res
                    .status(200)
                    .json({ message: "Login Success", token: token, uid: doc._id });
            }
        });
    })
        .catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.login = login;
const updateProfile = (req, res) => {
    const body = req.body;
    if (body.password) {
        return res.status(409).json({ message: "Password Cannot be Changed" });
    }
    body.userName = body.first_name + " " + body.last_name;
    User_1.default.findOneAndUpdate({ _id: body._id }, { $set: body }).exec().then((conc) => {
        if (!conc) {
            return res.status(409).json({ message: 'Invalid Request!' });
        }
        res.status(200).json({ message: "update Successful", baady: conc });
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.updateProfile = updateProfile;
const searchUserByName = (req, res) => {
    User_1.default.find({ userName: new RegExp(req.params.username.toLowerCase(), "") }).select('_id userName')
        .exec()
        .then((docs) => {
        if (docs.length === 0) {
            return res.status(409).json([]);
        }
        return res.status(200).json({ deets: docs });
    })
        .catch((err) => {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    });
};
exports.searchUserByName = searchUserByName;
const getUserDetailsById = (req, res) => {
    User_1.default.findById(req.params.id).exec().then((doc) => {
        if (!doc) {
            return res.status(409).json({ message: 'User Doesn\'t Exist!' });
        }
        Blog_1.default.find({ author_id: doc._id }).exec().then((docs) => {
            return res.status(200).json({ deets: doc, numeros: docs.length });
        }).catch((err) => {
            res.status(500).json({ message: err.message });
        });
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.getUserDetailsById = getUserDetailsById;
