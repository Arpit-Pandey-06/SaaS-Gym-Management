import bcrypt from "bcrypt"    


export  async function hashPassword(password:string) :Promise<string>{
  return await bcrypt.hash(password,10)
}

export async function passwordVerify(hashed_password:string,password:string):Promise<Boolean> {
  return await bcrypt.compare(password,hashed_password)
}

export async function RefreshTokenHashing(token:string) {
    return await bcrypt.hash(token,8)
}

export async function RefreshTokenCompare(hash_token:string,token:string):Promise<Boolean> {
  return await bcrypt.compare(token,hash_token)
}