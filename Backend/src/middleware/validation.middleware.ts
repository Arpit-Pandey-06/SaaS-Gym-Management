import { validationResult } from "express-validator"
import { type Request,type Response,type NextFunction } from "express"
import { ApiError } from "../utils/ApiError.utils.ts";


export const validate = (req:Request,res:Response,next:NextFunction)=>{
        const result = validationResult(req);
        if(result.isEmpty()){
            return next()
        }
        res.status(401).json({
            success:"fail",
            errors:result.array()

        })
}
