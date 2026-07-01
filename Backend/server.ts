import app from "./src/app.ts"
import { config } from "./src/config/envconfig.ts";

const PORT:number = config.PORT

app.listen(PORT|7000,()=>{
    console.log("app running");
    console.log(PORT)
    
})

app.get("/",(req,res)=>{
    res.send("Hello world")
})