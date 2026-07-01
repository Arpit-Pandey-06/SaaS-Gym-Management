import dotenv from "dotenv"
import { error } from "node:console"

dotenv.config()

function envload(name:string):string{
   const value = process.env[name]

    if(!value){
        throw new Error(`Env variable ${name} not exist`)
    }
    return value
}




const config =  {
    PORT :  parseInt(envload("PORT")),
    DATABASE_URL : envload("DATABASE_URL")

}

export {config}