import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "../config/envconfig";




// creating connection pool & connecting and also it thrown error automatically without any error

const pool = new  Pool({
    connectionString : config.DATABASE_URL,
    max : 5,
    min:3,
    connectionTimeoutMillis : 30000, // idle connection wait for pool to give connection for handshake
    idleTimeoutMillis : 60000 // when we borrow the extra time  it should be sit iddle then back to noraml
})

// creating adapted 

const adapter = new PrismaPg(pool)

//creating prisma client which implement the handshake with backend 

const prisma = new PrismaClient({adapter})



export default prisma