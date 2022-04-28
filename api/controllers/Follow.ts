import { Request, Response } from "express";
import Follow from "../models/Follow";
import User from "../models/User";

interface followAccountBody{
    follower_id : string,
    user_id : string // the acc that was followed
}
const followAccount = (req : Request, res : Response)=>{
    const body : followAccountBody = req.body;
    const newFollow = new Follow({
        follower_id : body.follower_id,
        user_id : body.user_id
    })
    newFollow.save().then(
        (conc : any)=>{
            res.status(200).json({message : "follow successful!"})
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message : err.message})
        }
    )
}

const unFollowAccount = (req : Request, res : Response)=>{
    const body : followAccountBody = req.body;
    Follow.findOneAndDelete({follower_id : body.follower_id, user_id : body.user_id}).exec().then(
        (conc : any)=>{
            if(!conc){
                return res.status(409).json({message : 'Something went wrong'})
            }
            res.status(200).json({message : 'Unfollowed Successfully!'})
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message : err.message})
        }
    )
}

export {followAccount, unFollowAccount}