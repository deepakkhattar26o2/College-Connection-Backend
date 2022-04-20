import { Response, NextFunction } from "express"
const jwt = require('jsonwebtoken')
require('dotenv').config()

export default (req: any, res:Response, next:NextFunction)=>{
    try{
        const token = req.headers.authorization
        const decoded = jwt.verify(token, process.env.myKey)
        req.userData = decoded
        next();
    }
    catch(err){
        return res.status(409).json({Message: 'Auth Failed!'})
    }
}