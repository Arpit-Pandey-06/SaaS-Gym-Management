import { log } from "node:console";
import Branch_Controller from "../controller/branch.controller.ts";
import prisma from "../db/prisma.ts";
import { BranchType } from "../generated/prisma/enums.ts";
import Branch_Repository from "../repository/Branch.repository.ts"
import {branch_code_genrator} from "../utils/branch_code.ts"
import { emailSend,verificaionEmail } from "../utils/mailGeneration.ts";
// import {UpdateBranchDTO} from "../utils/Payload.utils.ts"
type UpdateBranchDTO = {
    branch_name:string,
    business_email:string,
    business_phone:string,
    address:string,
    city:string,
    state:string,
    country:string,
    postal_code:string,
    capacity:string,
    opening_time:string,
    closing_time:string,
}


class Branch_Services{
    

    async create_branch(branch_data:any,ownerId:string){
            const gym = await Branch_Repository.exists_gym(ownerId)
            if(!gym){
                
                throw new Error("401 Gym Not Found")
            }
            
            const subscription = await Branch_Repository.exist_subscription(gym.id)
            if(!subscription){
                console.log("subscription status error");
                
                throw new Error("401 Subscription not Found")
            }
            
            if (subscription.status !== "ACTIVE"){
                console.log("Plan is not active");
                
                throw new Error("401 PLan is not Active")
            }
            const active_branch = await Branch_Repository.count_active_branch(gym.id)
             
            const subscription_plan_limit = await Branch_Repository.subscription_count(subscription.subscription_plan_id)
              
            
            if(!subscription_plan_limit){
               
                
                throw new Error("Subscipltion plan not exist")
            }
        
            if (subscription_plan_limit?.max_branches < active_branch){
             
                throw new Error("Active branch limit exceeds")
            }
            const exist_branch = await Branch_Repository.exist_branch_finding(gym.id)
        
            if(exist_branch?.business_email===branch_data.business_email || exist_branch?.address===branch_data.address || exist_branch?.business_phone === branch_data.business_phone){
                throw new Error("Branch Already exist")
            }

            const branch_code_exist = await Branch_Repository.get_branch_code(gym.id)
            const new_branch_code = branch_code_genrator(branch_code_exist)

            const branch_type_count = await Branch_Repository.count_active_branch(gym.id)
        
            const Created_Branch = await prisma.$transaction(async(tx)=>{
                
                const Branch = await Branch_Repository.create_branch(tx,{
                    branch_code:new_branch_code,
                    branch_name:branch_data.branch_name,
                    business_email:branch_data.business_email,
                    business_phone:branch_data.business_phone,
                    branch_type:(branch_type_count>=1) ? BranchType.FRANCHISE:BranchType.MAIN,
                    address:branch_data.address,
                    city:branch_data.city,
                    state:branch_data.state,
                    country:branch_data.country,
                    postal_code:branch_data.postal_code,
                    opening_time:branch_data.opening_time,
                    closing_time:branch_data.closing_time,
                    capacity:branch_data.capacity,
                    gymId:gym.id,

                })
                return Branch
            }
            
        )
        
        return {Created_Branch}

    }

//    async emailSending(ownerId:string,branch_name:string,protocol:any,host:any){
//         console.log(`protocol : ${typeof(protocol)} and host: ${typeof(host)}`);
//         const gym = await Branch_Repository.exists_gym(ownerId)
//             if(!gym){
                
//                 throw new Error("401 Gym Not Found")
//             }
//         emailSend({
//             email:gym?.business_email,
//             subject:"Branch Verification code",
//             mailGenContent:verificaionEmail(gym.gym_name,branch_name,`${protocol}://${host}/api/v1/verify-email`)
//         })
//         return true
//     }


    async all_data_gymbranch(ownerId:string){
        const gym = await Branch_Repository.exists_gym(ownerId)
            if(!gym){
                throw new Error("401 Gym Not Found")
            }
        const branches = await Branch_Repository.get_all_branch(gym?.id)
        return branches
    }
    
    async get_branch(ownerId:string,branch_code:string){
        const gym = await Branch_Repository.exists_gym(ownerId)
            if(!gym){
                throw new Error("401 Gym Not Found")
            }
        const branch_info = await Branch_Repository.getBranchData(gym.id,branch_code)
        if(!branch_info){
             console.log(branch_info);
            console.log(typeof(branch_info));
            throw new Error("401 branch not found")
        }  
        const branch = await Branch_Repository.get_branch(branch_info.id)
            if(!branch){
            throw new Error("Branch not found")
            }
        return {
            branch_data:branch,
            Gym_name:gym.gym_name
        
    }
}

async update_branch(ownerId:string,updated_data:UpdateBranchDTO,branch_code:string){
        const gym = await Branch_Repository.exists_gym(ownerId)
            if(!gym){
                throw new Error("401 Gym Not Found")
            }
        const branch_info = await Branch_Repository.getBranchData(gym.id,branch_code)
        if(!branch_info){
             console.log(branch_info);
            console.log(typeof(branch_info));
            throw new Error("401 branch not found")
        }  
        const result = await Branch_Repository.update_branch_data(updated_data,branch_info.id)
        return result
    }

async delete_branch(ownerId:string,branch_code:string){
    const gym = await Branch_Repository.exists_gym(ownerId)
            if(!gym){
                throw new Error("401 Gym Not Found")
            }
    const branch_info = await Branch_Repository.getBranchData(gym.id,branch_code)
        if(!branch_info){
             console.log(branch_info);
            console.log(typeof(branch_info));
            throw new Error("401 branch not found")
        }  
    const result = await Branch_Repository.delete_branch(branch_info.id)
    return result
}  

async restore(ownerId:string,id:string){
    const gym = await Branch_Repository.exists_gym(ownerId)
     if(!gym){
                throw new Error("401 Gym Not Found")
            }
    const result = await Branch_Repository.restore(id)
    return result
}
}

export default new Branch_Services