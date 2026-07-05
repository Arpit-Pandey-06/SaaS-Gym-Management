import express from "express"
import authrouter from "./routes/AuthRegister.routes.ts"


const app   = express()
app.use(express.json())

app.use("/api/v1/auth",authrouter)

export default app 