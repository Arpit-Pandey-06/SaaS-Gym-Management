export interface Tokenpayload {
    id:string,
    email:string,
    role:string,
    status:string
}

export interface RefreshTokenInterface{
    token_hash: string;
    userId: string;
    expires_at: Date;
}

