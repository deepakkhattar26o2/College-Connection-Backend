"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unFollowAccount = exports.followAccount = void 0;
const Follow_1 = __importDefault(require("../models/Follow"));
const followAccount = (req, res) => {
    const body = req.body;
    const newFollow = new Follow_1.default({
        follower_id: body.follower_id,
        user_id: body.user_id
    });
    newFollow.save().then((conc) => {
        res.status(200).json({ message: "follow successful!" });
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.followAccount = followAccount;
const unFollowAccount = (req, res) => {
    const body = req.body;
    Follow_1.default.findOneAndDelete({ follower_id: body.follower_id, user_id: body.user_id }).exec().then((conc) => {
        if (!conc) {
            return res.status(409).json({ message: 'Something went wrong' });
        }
        res.status(200).json({ message: 'Unfollowed Successfully!' });
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.unFollowAccount = unFollowAccount;
