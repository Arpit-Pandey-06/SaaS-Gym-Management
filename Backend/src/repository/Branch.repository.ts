import prisma from '../db/prisma.ts'

class Branch_Repository {

    async create_branch(tx:any,branch_data:any){
        return await tx.branch.create({
            data :branch_data
        })
    }
    
    async exists_gym(ownerId:string){
        return await prisma.gym.findFirst({
            where : {
                ownerId
            }
        })
    }
    async exist_subscription(gymId:string){
        return await prisma.gymSubscription.findFirst({
            where:{
                gymId
            }
        })
    }
    async count_active_branch(gymId:string){
        return await prisma.branch.count({
            where:{
                gymId
            }
        })
    }
    async subscription_count(subscription_plan_id:string){
        return await prisma.subscriptionPlan.findUnique({
            where:{
                id:subscription_plan_id
            }
        })
    }
    async exist_branch_finding(gymId:string){
        return await prisma.branch.findFirst({
            where:{
                gymId
            },
        })
    }

    async get_branch_code(gymId:string){
        return await prisma.branch.findFirst({
            where:{
                gymId,
            },
            orderBy:{
                branch_code:'desc'
            },
            select:{branch_code:true}
        })
    }

    async get_all_branch(gymId:string){
        return await prisma.branch.findMany({
            where:{
                gymId:gymId
            },
            orderBy:{
                branch_code:"asc"
            },
            select:{
                branch_code:true,
                branch_name:true,
                branch_type:true
            }
        })
    }

    async get_branch_type(gymId:string){
        return await prisma.branch.count({
            where:{gymId:gymId}
        })
    }

    async get_branch(id:string){
        return await prisma.branch.findFirst({
            where:{
                id:id
            },
            select:{
                branch_name:true,
                status:true,
                branch_code:true,
                branch_type:true
            }
        })
    }

    async getBranchData(gymId:string,branch_code:string){
        return await prisma.branch.findFirst({
            where:{
                gymId:gymId,
                branch_code:branch_code,
                deleted_at:null
            }
        })
    }

    async update_branch_data(update_data:any,id:string){
        return await prisma.branch.update({
            where:{
               id:id
            },

            data:update_data
        })
    }

    async delete_branch(id:string){
        return await prisma.branch.update({
            where:{
                id:id
            },
            data:{
                deleted_at:new Date()
            }
        })
    }
    async restore(id:string){
        return await prisma.branch.update({
            where:{
                id:id
            },
            data:{
                deleted_at:null
            }
        })
    }
}


export default new Branch_Repository