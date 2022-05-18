import { Request, Response } from "express";
import Follow from "../models/Follow";

interface followAccountBody{
    follower_id : string,
    user_id : string // the acc that was followed
}
const followAccount = (req : Request, res : Response)=>{
    const body : followAccountBody = req.body;
    Follow.findOne({follower_id : body.follower_id, user_id : body.user_id}).exec().then(
        (doc : any)=>{
            if(doc){
                return res.status(409).json({message : "You've already followed the user"})
            }
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

const getAllFollowers = (req : Request, res : Response) =>{
    Follow.find({user_id : req.params.id}).exec().then(
        (docs : any)=>{
            res.status(200).json(docs)
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message : err.message})
        }
    )
}

const getAllFollowing = (req : Request, res : Response) =>{
    Follow.find({follower_id : req.params.id}).exec().then(
        (docs : any) =>{
            res.status(200).json(docs)
        }
    ).catch(
        (err : Error) =>{
            res.status(500).json({message : err.message})
        }
    )
}

export {followAccount, unFollowAccount, getAllFollowers, getAllFollowing}