"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcr = require("bcrypt");
const jwt = require("jsonwebtoken");
const User_1 = require("../controllers/User");
const Follow_1 = require("../controllers/Follow");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.status(200).json({ message: "User Route Works" });
});
router.post('/signup', User_1.signup); //signup route
router.post('/login', User_1.login); //login route
router.get('/u/:username', User_1.searchUserByName); //search for a user by name
router.get('/d/:id', User_1.getUserDetailsById); //get a single user's details by id
router.patch('/update', User_1.updateProfile); //profile update route
router.post('/follow', Follow_1.followAccount);
router.post('/unfollow', Follow_1.unFollowAccount);
exports.default = router;
