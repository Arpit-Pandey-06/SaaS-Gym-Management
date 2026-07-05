import prisma from "../db/prisma.ts";
// import { Role } from "../generated/prisma/enums";
import AuthRepository from "../repository/Auth.repository.ts";
import hashPassword from "../utils/passwordHash.utils.ts";

class AuthService {
    async ownerRegister(data:any){
        const existing_user = await AuthRepository.findUserByEmail(data.email)
        if(existing_user){
            throw new Error("User is existing")
        }
        const hashedpassword = await hashPassword(data.password)
        delete data.password
        const subscriptionId = await AuthRepository.FindSubscriptionByPlan("Starter")
        if(!subscriptionId){
            throw new Error("susbscription plan not exist ")
        }
        const result = await prisma.$transaction(async (tx)=>{
            const user = await AuthRepository.createUser(tx,{
                full_name:data.full_name,
                email:data.email,
                password_hash:hashedpassword,
                role:data.role

            }) 
            const gym = await AuthRepository.createGym(tx,{
                gym_name:data.gym_name,
                userId:user.id,
                business_email:data.business_email
            })
            const gymSubscription = await AuthRepository.createSubscription(tx,{
                subscription_plan_id:subscriptionId.id,
                gymId:gym.id
            })
               return{
            user,
            gym,
            gymSubscription   
        }
        })

     
        
    }
}

export default new AuthService()