import prisma from "../db/prisma.ts"
import type { RefreshTokenInterface } from "../utils/Payload.utils.ts";

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

  async FindUserById(user_id:string){
    return await prisma.user.findUnique({
      where:{
        id:user_id
      }
    })
  }

  async RefreshTokenSave(token:RefreshTokenInterface){
    await prisma.refreshToken.upsert({
      where:{
        userId:token.userId
      },
      update:{
        token_hash:token.token_hash,
        expires_at:token.expires_at
      },
      create:{
        token_hash:token.token_hash,
        userId:token.userId,
        expires_at:token.expires_at
      }
    })
    
  }

  async DeleteRefreshToken(id:string){
    await prisma.refreshToken.delete({
      where:{
        userId:id
      }
    })
  }

}


export default new AuthRepository()
