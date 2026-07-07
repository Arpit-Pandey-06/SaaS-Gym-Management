import { type Request,type Response,type NextFunction} from "express";
import AuthService from "../services/auth.services.ts";
import { ApiError } from "../utils/ApiError.utils.ts";
import { Role } from "../generated/prisma/enums.ts";

class AuthRegister{
    async RegisterOwner(req:Request,res:Response,next:NextFunction){
        try{
            const result = await AuthService.ownerRegister(req.body)
            return res.status(200).json({
                "sucess":true,
                "message":"Owner registered successfully",
                "data":result
            })
        }
        catch(err){
            console.log(err)
            throw new ApiError("Unsuccssful registration of owner",401,err)
        }
    }

    async loginUser(req:Request,res:Response,next:NextFunction){
        try{
        const result = await AuthService.login(req.body)
        
        res.cookie("refresh_token",result.refresh_token,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:7*24*60*60*1000
        })
        res.status(200).json({
                "sucess":true,
                "message":"Login successful",
                "data":{
                    access_token:result.access_token,
                    user:result.user
                }
        })
        }
        catch (err){
            console.log(err);
            throw new Error("402 User not Crediable")
            
        }
    }

    async RefreshToken(req:Request,res:Response,next:NextFunction){
        try{
            const result = await AuthService.AccesstokenReGenration(req.cookies.refresh_token)
            return res.status(200).json({
                access_token :result
            })
        }
        catch(err){
            console.log(err)
            throw new ApiError("Unsuccssful registration of owner",401,err)
        }
    }

    async getCurrentUser(req:Request,res:Response,next:NextFunction){
    try{
        const result = await AuthService.getCurrentUser(req.user.id)
        if(!result.success){
            res.status(401).json({
                success:result.success,
                msg:result.msg
            })
        }
        res.status(200).json({
            success:result.success,
            user:result.data
        })
    }
    catch(err){
        console.log(err);
        res.status(401).json({
            msg:"401 Unauthorized access"
        })
        
    }
     }

     async Logout(req:Request,res:Response,next:NextFunction){
        try{
        const result = await AuthService.logout(req.cookies.refresh_token)
        if(!result.success){
            res.status(401).json({
                success:false,
                msg:"Not Successfully logout"
            })
        }
        res.clearCookie("refresh_token")
        res.status(200).json({
            success:true,
            msg:"Successfully Logout"

        })
    }
    catch(err){
        throw new Error(`Problem in logout ${err}`)
    }
     }

}
export default new AuthRegister()