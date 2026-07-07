import type {Tokenpayload} from "../utils/Payload.utils.ts"

declare global {
    namespace Express {
        interface Request {
            user:Tokenpayload
        }
    }
}


export{}