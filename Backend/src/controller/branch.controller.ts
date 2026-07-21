import type { Request,Response,NextFunction } from "express"
import Branch_Services from "../services/branch.services.ts"
import { error } from "node:console"
import { Result } from "pg"

class Branch_Controller{

    async register_branch(req:Request,res:Response,next:NextFunction){
        try{
            const {branch_name,...brnach_info} = req.body
           const result = await Branch_Services.create_branch(req.body,req.user.id)
           //Branch_Services.emailSending(req.user.id,req.body.branch_name,req.protocol,req.get('host'))
           res.status(200).json({
            success:true,
            message:"successfully register",
            data:result
           })
        }
        catch(err){
            res.status(401).json({
                success:false,
                messgae:"401 Fail in creation of branch",
                error:err
            })
        }
    }


    async all_branch(req:Request,res:Response,next:NextFunction){
        try{
        const result = await Branch_Services.all_data_gymbranch(req.user.id)
        res.status(200).json({
            success:true,
            message:"Result are succesfully get",
            data: result
        })
        }
        catch(err){
            res.status(401).json({
                success:false,
                message:"Result not Found",
                error:err
            })
        }
    }

    async get_branch(req:Request,res:Response,next:NextFunction){
        try{
            const branch_code : string | any = req.params.branch_code
            const branch = await Branch_Services.get_branch(req.user.id,branch_code)
            res.status(200).json({
                success:true,
                message:"Result is successfully founded",
                data:branch
            })
        }
        catch(err:any){
            res.status(401).json({
                success:true,
                message:"Resulted Branch not found ",
                Error:err.toString()
            })
        }
    }


}

export default new Branch_Controller()