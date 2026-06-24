import app from "./src/app.js"



app.listen(8000,()=>{
    console.log("app running");
    
})

app.get("/",(req,res)=>{
    res.send("Hello world")
})