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
    DATABASE_URL : envload("DATABASE_URL"),
    JWT_ACCESS_TOKEN_SECRET:envload("JWT_ACCESS_TOKEN_SECRET"),
    JWT_REFRESH_TOKEN_SECRET:envload("JWT_REFRESH_TOKEN_SECRET"),
    JWT_ACCESS_TOKEN_EXPIRE:envload("JWT_ACCESS_TOKEN_EXPIRE"),
    JWT_REFRESH_TOKEN_EXPIRE:envload("JWT_REFRESH_TOKEN_EXPIRE"),
    JWT_ALGORITHM:envload("JWT_ALGORITHM"),
    NODEMAILER_AUTH_HOST:envload("NODEMAILER_AUTH_HOST"),
    NODEMAILER_AUTH_PORT:parseInt(envload("NODEMAILER_AUTH_PORT")),
    NODEMAILER_AUTH_USER:envload("NODEMAILER_AUTH_USER"),
    NODEMAILER_AUTH_PASS:envload("NODEMAILER_AUTH_PASS")

}
export {config}