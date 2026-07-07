
import {config} from "../config/envconfig.ts"
import jwt from "jsonwebtoken"
import type {Tokenpayload} from "./Payload.utils.ts"

export function AccessToken(payload:Tokenpayload){
        const accesstoken =  jwt.sign(payload,config.JWT_ACCESS_TOKEN_SECRET,{
            algorithm:"HS256",
            expiresIn:"15m"
        }
    )
    return accesstoken
}

export function RefreshToken(payload:Tokenpayload){
        const refreshToken =  jwt.sign(payload,config.JWT_REFRESH_TOKEN_SECRET,{
            algorithm:"HS256",
            expiresIn:"5d"
        }
    )
    return refreshToken
    }

export function verifyAccessToken(token:string):any{
    try{
    const payloadData = jwt.verify(token,config.JWT_ACCESS_TOKEN_SECRET) as Tokenpayload
    return payloadData
}
    catch(errors){
        console.log(errors)
        throw new Error("401 Unauthorized access")
        }
    }

export function verifyRefreshToken(token:string):any{
        try{
            const refresh_payload = jwt.verify(token,config.JWT_REFRESH_TOKEN_SECRET) as Tokenpayload
            const user_id = refresh_payload.id
            return user_id
        }
        catch(err){
            throw new Error("401 Unauthorized access")
        }
    }

