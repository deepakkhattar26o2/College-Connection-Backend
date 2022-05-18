import express, {Router, Response} from "express";
const bcr = require("bcrypt");
const jwt = require("jsonwebtoken");
import User from "../models/User";
import { signup, login, updateProfile, searchUserByName, getUserDetailsById,} from "../controllers/User";
import { followAccount, getAllFollowers, getAllFollowing, unFollowAccount } from "../controllers/Follow";
const router : Router = express.Router()

router.get('/', (req : any, res : Response)=>{
    res.status(200).json({message: "User Route Works"})
})

router.post('/signup', signup)//signup route

router.post('/login', login)//login route

router.get('/u/:username', searchUserByName)//search for a user by name

router.get('/d/:id', getUserDetailsById)//get a single user's details by id

router.patch('/update/:id', updateProfile)//profile update route

router.post('/follow', followAccount)

router.post('/unfollow', unFollowAccount)

router.get('/followers/:id', getAllFollowers);

router.get('/following/:id', getAllFollowing);

export default router