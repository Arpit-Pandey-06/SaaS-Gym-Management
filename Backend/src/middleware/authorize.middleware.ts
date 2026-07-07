import { type Request,type Response, type NextFunction } from "express";

export function authorize(...roles:Array<string>){
    return (req:Request,res:Response,next:NextFunction)=>{
        if(!roles.includes(req.user.role)){
            res.status(401).json({
                msg:"401 Unauthorized access"
            })
        }
         next()
    }
}