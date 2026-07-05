import prisma from "../db/prisma.ts"

class AuthRepository {
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

    async createUser(tx:any,userData: any) {
    return await tx.user.create({
     data : userData
    })
  }

   async createGym(tx:any,gymdata:any) {
    return await tx.gym.create({
      data:gymdata,
    })
  }


  async createSubscription(tx:any,subscription:any) {
    return await tx.gymSubscription.create({
      data:subscription
    })
  }

  async FindSubscriptionByPlan(name:string){
    return await prisma.subscriptionPlan.findFirst({
      where:{
        plan_name:name
      }
    })
  }
}


export default new AuthRepository()
