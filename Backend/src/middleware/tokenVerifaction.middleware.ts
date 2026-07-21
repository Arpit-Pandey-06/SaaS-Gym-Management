
import { type Request,type Response, type NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils.ts";

export function accesstokenVerify(req:Request,res:Response,next :NextFunction){
        const authHeader:any = req.headers.authorization
        if(!authHeader?.startsWith("Bearer ")){
            res.status(401).json({
                success:"Fail",
                msg:"Token not send by header"
            })
        }
        const token = authHeader.split(" ")[1]
        try{
        const payload = verifyAccessToken(token)
        req.user = payload 
        next()
        }
        catch(err){
            return res.status(401).json({
                success:false,
                msg:"Token Expired or invalid"
            })
        }
}

