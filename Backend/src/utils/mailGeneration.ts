import Mailgen from "mailgen"
import { text } from "node:stream/consumers"
import nodemailer from "nodemailer"
import { config } from "../config/envconfig.ts"

const emailSend  = async function (options:any){
    const mailgen = new Mailgen({
        theme:"default",
        product:{
            name:"Fit SaaS",
            link:"https://www.FitSaas.com"
        }

    })

    const plainmailConetent = mailgen.generatePlaintext(options.mailGenContent)
    const htmlmailContent = mailgen.generate(options.mailGenContent)

    const email = {
        from:"fitSaas@gamil.com",
        to:options.email,
        subject:options.subject,
        text:plainmailConetent,
        html:htmlmailContent
    }
    try{
      const transport =  nodemailer.createTransport({
        host:config.NODEMAILER_AUTH_HOST,
        port:config.NODEMAILER_AUTH_PORT,
        auth:{
            user:config.NODEMAILER_AUTH_USER,
            pass:config.NODEMAILER_AUTH_PASS
        }
      })
      transport.sendMail(email)
}
catch(err){
    console.log("Email not send",err)
}
    }
   

const verificaionEmail = function (gym_name:string,branch_name:string,verificationUrl:string){
    return {
        body : {
            name:`${branch_name} new branch `,
            intro:`Welcome ${gym_name}, We are very greatfull for your trust us \n We have the new request to verify your entity for creation new branch`,
            action :{
                instructions:`To approve and verify this creation please click link below`,
                button:{
                    color:'#0FFC8C',
                    text:`click to verify`,
                    link:verificationUrl
                }
            },
            outro:"Thanks for Trust our platform"

        }
    }
}

export {verificaionEmail,
        emailSend    
}