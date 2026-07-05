import { type Request,type Response,type NextFunction} from "express";
import AuthService from "../services/auth.services.ts";
import { ApiError } from "../utils/ApiError.utils.ts";

class AuthRegister{
    async RegisterOwner(req:Request,res:Response,next:NextFunction){
        try{
            const result = await AuthService.ownerRegister(req.body)
            return res.status(200).json({
                "message":"Owner Register successfully with gym",
                "data":result
            })
        }
        catch(err){
            console.log(err)
            throw new ApiError("Unsuccssful registration of owner",401,err)
        }
    }

}
export default new AuthRegister()