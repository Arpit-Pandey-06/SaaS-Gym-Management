export class ApiError extends Error {
    public readonly code : Number
    public readonly errors :any

    public constructor(msg:string,code:number,errors:any){
        super(msg)
        this.code = code
        this.errors = errors
    }
}