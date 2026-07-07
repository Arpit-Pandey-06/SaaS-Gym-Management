import express from "express"
import authrouter from "./routes/AuthRegister.routes.ts"
import cookieParser from "cookie-parser"
import cors from "cors"


const app   = express()

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

app.use(cookieParser())

app.use(express.json())

app.use("/api/v1/auth",authrouter)
export default app 